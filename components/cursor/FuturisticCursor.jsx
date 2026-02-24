 export default function FuturisticCursor() {
  const cursorRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  // Track mouse movement
  useEffect(() => {
    const cursor = cursorRef.current;

    const handleMove = (e) => {
      if (cursor) {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Hide default cursor
  useEffect(() => {
    document.body.classList.add("cursor-none");
    return () => document.body.classList.remove("cursor-none");
  }, []);

  // Hover effect on clickable elements
  useEffect(() => {
    const set = () => setHovering(true);
    const unset = () => setHovering(false);
    const elements = document.querySelectorAll(
      "button, a, [tabindex]:not([tabindex='-1']), input, label"
    );

    elements.forEach((el) => {
      el.addEventListener("mouseenter", set);
      el.addEventListener("mouseleave", unset);
    });

    return () =>
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", set);
        el.removeEventListener("mouseleave", unset);
      });
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-10000 pointer-events-none mix-blend-screen transition-transform duration-75"
    >
      <div
        className={`w-4 h-4 rounded-full border-2 ${
          hovering
            ? "border-cyan-300 bg-cyan-200/25"
            : "border-cyan-500 bg-cyan-400/20"
        } transition-all duration-150`}
        style={{
          boxShadow: hovering
            ? "0 0 20px 6px rgba(34,211,238,0.5)"
            : "0 0 12px 3px rgba(34,211,238,0.4)",
        }}
      />
    </div>
  );
}