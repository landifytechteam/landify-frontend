import { useState } from "react";
import { ArrowUpRight, Mail, MessageCircleQuestionMark, Plus, Scale } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { contact, faqs, faqTopics } from "../../data/landing";

// Numbers stay the same whichever topic is picked (question 7 is always "07")
const numberOf = Object.fromEntries(faqs.map((f, i) => [f.id, String(i + 1).padStart(2, "0")]));

export function Faq() {
  const [topic, setTopic] = useState("all");
  const [openId, setOpenId] = useState(faqs[0].id); // first answer starts open

  const shown = topic === "all" ? faqs : faqs.filter((f) => f.topic === topic);
  const countFor = (id) => (id === "all" ? faqs.length : faqs.filter((f) => f.topic === id).length);

  const pickTopic = (id) => {
    setTopic(id);
    // Open the first question of the new topic, so there's always something to read
    const first = id === "all" ? faqs[0] : faqs.find((f) => f.topic === id);
    setOpenId(first?.id ?? null);
  };

  return (
    <section id="faq" className="relative overflow-hidden bg-white py-24">
      {/* Soft background glow, purely decorative */}
      <div
        className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-brand-50 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[400px_1fr] lg:gap-20 xl:px-0">
        {/* Left column stays in view while you read the answers (desktop).
            Sticky goes on this wrapper, Reveal inside: a transform on the sticky
            element itself would stop it sticking. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal from="left">
            <Eyebrow>Questions, answered</Eyebrow>
            <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
              Honest answers before you commit.
            </h2>
            <p className="mt-6 leading-7 text-body">
              Buying land is a big decision. Here is how Landify checks listings, how payments work
              and what happens if plans change.
            </p>
          </Reveal>

          <Reveal from="left" delay={200}>
            <div className="relative mt-10 overflow-hidden rounded-2xl bg-brand-900 p-7 text-white">
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gold-500/25 blur-2xl"
                aria-hidden
              />
              <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <MessageCircleQuestionMark className="h-5 w-5 text-gold-500" aria-hidden />
              </span>
              <p className="relative mt-5 text-xl font-semibold">Still have questions?</p>
              <p className="relative mt-2 text-sm leading-6 text-white/80">
                Our team will walk you through a listing, a payment plan or a document before you pay
                anything.
              </p>
              <a
                href={`mailto:${contact.email}`}
                className="group relative mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-gold-500 px-5 text-sm font-semibold text-ink transition-colors hover:bg-gold-400"
              >
                <Mail className="h-4 w-4" aria-hidden />
                Ask our team
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
            </div>
          </Reveal>

          <Reveal delay={350}>
            <p className="mt-6 flex items-start gap-2 text-xs leading-5 text-body">
              <Scale className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
              These answers are general guidance, not legal advice. Always have your own lawyer
              review the documents before you commit.
            </p>
          </Reveal>
        </div>

        <div>
          {/* Topic filter. Scrolls sideways on small phones instead of wrapping into a tall block. */}
          <Reveal>
            <div
              className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
              role="group"
              aria-label="Filter questions by topic"
            >
              {faqTopics.map((t) => {
                const active = topic === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => pickTopic(t.id)}
                    aria-pressed={active}
                    className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                      active
                        ? "border-brand-600 bg-brand-600 text-white shadow-[0_8px_20px_-8px_rgba(11,93,59,0.6)]"
                        : "border-line bg-white text-body hover:border-brand-600/40 hover:text-ink"
                    }`}
                  >
                    {t.label}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold transition-colors ${
                        active ? "bg-white/20 text-white" : "bg-canvas text-body"
                      }`}
                    >
                      {countFor(t.id)}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <ul className="reveal-stagger mt-6 space-y-3">
            {shown.map((faq) => (
              <Reveal as="li" key={faq.id}>
                <FaqItem
                  faq={faq}
                  number={numberOf[faq.id]}
                  open={openId === faq.id}
                  onToggle={() => setOpenId((id) => (id === faq.id ? null : faq.id))}
                />
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** One question. Only one is open at a time; clicking an open one closes it. */
function FaqItem({ faq, number, open, onToggle }) {
  const buttonId = `faq-${faq.id}-question`;
  const panelId = `faq-${faq.id}-answer`;

  return (
    <div
      className={`group rounded-2xl border transition-all duration-300 ${
        open
          ? "border-brand-600/30 bg-brand-50/50 shadow-[0_14px_40px_-22px_rgba(19,38,30,0.4)]"
          : "border-line bg-white hover:border-brand-600/30 hover:shadow-[0_10px_30px_-24px_rgba(19,38,30,0.5)]"
      }`}
    >
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full cursor-pointer items-center gap-4 rounded-2xl px-5 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:gap-5 sm:px-6"
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300 ${
              open ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-900 group-hover:bg-brand-600/15"
            }`}
          >
            {number}
          </span>
          <span className={`flex-1 text-base font-semibold sm:text-lg ${open ? "text-brand-900" : "text-ink"}`}>
            {faq.question}
          </span>
          {/* The plus turns 45° into a ×, so the icon itself says "close" */}
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
              open
                ? "rotate-45 border-brand-600 bg-brand-600 text-white"
                : "border-line text-brand-600 group-hover:border-brand-600/50"
            }`}
            aria-hidden
          >
            <Plus className="h-4 w-4" />
          </span>
        </button>
      </h3>

      {/* Height animation trick: a grid row going from 0fr to 1fr slides open to
          exactly the text's height, with no measuring in JavaScript.
          `inert` hides the closed answer from keyboard and screen readers. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-6 text-[15px] leading-7 text-body sm:pl-21 sm:pr-16">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}
