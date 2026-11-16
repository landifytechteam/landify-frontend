import { useEffect, useRef, useState } from "react";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

// Load Google's sign-in script once for the whole app
let scriptPromise;
function loadGoogleScript() {
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Couldn't load Google sign-in."));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Google's own "Sign in with Google" button. When the user picks an account,
 * `onToken(idToken)` is called. Send that to POST /auth/google (AuthContext.loginWithGoogle).
 *
 * Needs VITE_GOOGLE_CLIENT_ID in .env: the SAME Google OAuth client ID the backend
 * verifies tokens against (ask the backend dev). Without it the button hides itself.
 */
export function GoogleSignInButton({ onToken, text = "continue_with" }) {
  const box = useRef(null);
  const onTokenRef = useRef(onToken);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    onTokenRef.current = onToken;
  });

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled || !box.current) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response) => onTokenRef.current(response.credential),
        });
        window.google.accounts.id.renderButton(box.current, {
          theme: "outline",
          size: "large",
          text, // "signin_with" | "signup_with" | "continue_with"
          width: box.current.offsetWidth || 360,
        });
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [text]);

  if (!CLIENT_ID || failed) return null;
  return <div ref={box} className="flex h-12 w-full justify-center" />;
}