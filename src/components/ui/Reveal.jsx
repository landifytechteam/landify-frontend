import { useReveal } from "./useReveal";

/**
 * Wrap anything to make it appear as it scrolls into view.
 *
 *   <Reveal>...</Reveal>                       fades up
 *   <Reveal from="left" delay={150}>...</Reveal>  slides in from the left, 150ms later
 *   <Reveal as="li" className="...">...</Reveal>  renders an <li> instead of a <div>
 *
 * `delay` (ms) is handy for lists: delay={i * 100} makes items appear one after another.
 * Inside a parent with className="reveal-stagger", children are staggered automatically.
 */
export function Reveal({ as: Tag = "div", from = "up", delay = 0, style, children, ...props }) {
  const reveal = useReveal(from);
  return (
    <Tag {...props} {...reveal} style={delay ? { ...style, "--reveal-delay": `${delay}ms` } : style}>
      {children}
    </Tag>
  );
}
