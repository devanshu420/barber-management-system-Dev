import React, { useRef, useState, useEffect } from "react";

// Reusable scroll fade component
const ScrollFade = ({ children, className = "", delay = 0 }) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

const FeatureInclude = () => {
  return (
    <div className="flex justify-center items-center w-full py-14 bg-white min-h-[520px]">
      <div className="w-[90%] max-w-6xl flex flex-col md:flex-row items-center justify-center gap-4 rounded-xl overflow-hidden">
        {/* Left side layered cards */}
        <ScrollFade delay={100} className="relative flex justify-center items-center flex-1 min-w-[340px] min-h-[410px]">
          {/* Back gradient layer */}
          <div className="absolute left-6 top-5 w-[320px] h-[410px] rounded-xl bg-gradient-to-br from-pink-200 to-gray-700 opacity-70 z-0" />
          {/* Middle cyan layer */}
          <div className="absolute left-0 top-0 w-[320px] h-[410px] rounded-xl bg-gradient-to-bl from-teal-500 via-cyan-400 to-gray-800 opacity-80 z-10" />
          {/* Foreground image card */}
          <div className="relative z-20">
            <img
              src="https://cdn.prod.website-files.com/65ce807a7f0051db5b622a45/65ee13e9c8f322f7a8ce7c37_Center%20Photo.avif"
              alt="Pricing Feature"
              className="w-[230px] h-[290px] object-cover rounded-xl shadow-xl border-4 border-black/10"
            />
          </div>
        </ScrollFade>

        {/* Right side: pricing details */}
        <ScrollFade delay={300} className="flex-1 bg-gray-800 rounded-xl px-10 py-12 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <h2 className="text-white font-bold text-2xl mb-3">Every feature included</h2>
          <div className="font-extrabold text-5xl text-pink-200 mb-4">₹100</div>
          <button className="bg-white text-black font-semibold px-7 py-3 rounded-lg mb-7 mt-2 shadow hover:bg-pink-100 transition">
            Start free now
          </button>
          <div className="text-white/90 text-sm mb-2">₹20 per add'l user</div>
          <div className="text-white/70 text-sm mb-2">Monthly, plus tax.</div>
          <div className="text-white/70 text-sm mb-2">No commitment, cancel anytime.</div>
          <div className="text-white/70 text-sm mb-2">Try free for 14 days.</div>
          <div className="text-white/40 text-xs mt-2">*Payment processing & hardware not included</div>
        </ScrollFade>
      </div>
    </div>
  );
};

export default FeatureInclude;
