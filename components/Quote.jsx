import React, { useRef, useState, useEffect } from "react";

// Scroll fade + slide component
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

const Quote = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col lg:flex-row items-center gap-16 w-full max-w-4xl mx-auto px-8 py-24">
        {/* Image card */}
        <ScrollFade delay={200} className="flex-shrink-0">
          <div
            className="rounded-xl overflow-hidden shadow-xl"
            style={{
              background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
            }}
          >
            <img
              src="https://cdn.prod.website-files.com/65ce807a7f0051db5b622a45/664ade6543df10ce514c1230_dave-reyes.webp"
              alt="Barber"
              className="w-[260px] h-[340px] object-cover"
            />
            <div className="h-5 bg-pink-200 w-full" />
          </div>
        </ScrollFade>

        {/* Quote Section */}
        <ScrollFade delay={400} className="lg:ml-12 max-w-xl">
          <p className="font-bold text-xl lg:text-2xl text-gray-800 mb-3 leading-snug">
            “Booksy changed my life. I wasn’t living to my true potential and then I discovered Booksy. My bookings tripled, prices tripled, and I eliminated the clientele that didn’t respect my time. Now I have more time with my family and more personal time.”
          </p>
          <span className="block text-teal-400 mt-4 mb-2 text-2xl">–</span>
          <span className="block text-base text-gray-600">Dave Reyes Cutz</span>
        </ScrollFade>
      </div>
    </div>
  );
};

export default Quote;
