/**
 * Scroll reveal: IntersectionObserver adds `.is-revealed`; CSS in system.css does the motion.
 * Reduced motion = everything visible immediately.
 */
const nodes = document.querySelectorAll("[data-reveal], [data-reveal-stagger]");

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
  nodes.forEach((el) => el.classList.add("is-revealed"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  nodes.forEach((el) => observer.observe(el));
}
