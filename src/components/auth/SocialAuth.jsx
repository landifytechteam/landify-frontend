/** "or" divider between the main button and Google. */
export function OrDivider() {
  return (
    <div className="my-4 flex items-center gap-4 text-xs text-body">
      <span className="h-px flex-1 bg-line" />
      or
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export function GoogleButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-line bg-white text-sm font-medium text-ink transition-colors hover:border-brand-600"
    >
      <GoogleIcon />
      {children}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-4.5 w-4.5" aria-hidden>
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8a10 10 0 0 1-4.4 6.6v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.1z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.6-3.8-12.3-9H4.4v5.7A22 22 0 0 0 24 46z" />
      <path fill="#FBBC05" d="M11.7 28.2a13.2 13.2 0 0 1 0-8.4v-5.7H4.4a22 22 0 0 0 0 19.8z" />
      <path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3A22 22 0 0 0 4.4 14.1l7.3 5.7c1.7-5.2 6.6-9 12.3-9z" />
    </svg>
  );
}