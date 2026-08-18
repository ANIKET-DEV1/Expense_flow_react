import { useEffect } from 'react';

// Uses .in class (matching original CSS: .reveal.in)
// MutationObserver ensures elements added by route navigation are also observed.
const useScrollReveal = () => {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    const observe = () => {
      document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
    };

    observe();

    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
};

export default useScrollReveal;
