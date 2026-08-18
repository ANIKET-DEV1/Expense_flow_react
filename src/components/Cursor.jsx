import React, { useEffect, useRef } from 'react';

const Cursor = () => {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const mouse   = useRef({ x: 0, y: 0 });
  const ring    = useRef({ x: 0, y: 0 });
  const rafRef  = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const r    = ringRef.current;
    const body = document.body;

    body.classList.add('has-custom-cursor');
    dot.style.opacity  = '1';
    r.style.opacity    = '1';

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
    };

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.13;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.13;
      r.style.left = ring.current.x + 'px';
      r.style.top  = ring.current.y + 'px';
      rafRef.current = requestAnimationFrame(animate);
    };

    // Hover state
    const SELECTORS = 'a, button, [role="button"], input, select, textarea, label, .seg-tab, .tag-pill, .nav-link';
    const onEnter = () => body.classList.add('cursor-hover');
    const onLeave = () => body.classList.remove('cursor-hover');

    const attachHover = () => {
      document.querySelectorAll(SELECTORS).forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    // Click state
    const onDown = () => body.classList.add('cursor-click');
    const onUp   = () => body.classList.remove('cursor-click');

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);

    attachHover();
    rafRef.current = requestAnimationFrame(animate);

    // Re-attach when DOM changes (route navigation)
    const mo = new MutationObserver(attachHover);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      body.classList.remove('has-custom-cursor', 'cursor-hover', 'cursor-click');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      cancelAnimationFrame(rafRef.current);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div id="cursor-dot"  ref={dotRef}  />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
};

export default Cursor;
