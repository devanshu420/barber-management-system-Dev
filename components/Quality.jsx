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

const Qaulity = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white">
    {/* Gradient Card */}
    <ScrollFade delay={100} className="w-full max-w-5xl rounded-2xl mx-auto shadow-2xl overflow-hidden bg-gradient-to-b from-gray-800 to-teal-400 py-16 px-10 flex flex-col items-center">
      <h2 className="text-white font-bold text-3xl lg:text-4xl text-center mb-14">
        What makes us different
      </h2>

      {/* Features Row */}
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-12 w-full mb-8">
        {/* Feature 1 */}
        <ScrollFade delay={200} className="text-center flex-1 px-6">
          <div className="flex justify-center">
            <span className="w-14 h-14 flex items-center justify-center border-2 border-white rounded-full text-white font-bold mb-5 text-2xl">
              01
            </span>
          </div>
          <h3 className="text-white font-bold text-lg mb-3">
            All-inclusive, transparent pricing
          </h3>
          <p className="text-white text-base font-medium opacity-90">
            We believe all business owners deserve access to the tools they need to succeed. Every provider has access to all of our available features for one low price.
          </p>
        </ScrollFade>

        {/* Feature 2 */}
        <ScrollFade delay={400} className="text-center flex-1 px-6">
          <div className="flex justify-center">
            <span className="w-14 h-14 flex items-center justify-center border-2 border-white rounded-full text-white font-bold mb-5 text-2xl">
              02
            </span>
          </div>
          <h3 className="text-white font-bold text-lg mb-3">
            Marketplace and Customer App to get more visibility
          </h3>
          <p className="text-white text-base font-medium opacity-90">
            Millions of customers around the world use Booksy to find and book services near them. Don't miss out, get your business in front of them.
          </p>
        </ScrollFade>

        {/* Feature 3 */}
        <ScrollFade delay={600} className="text-center flex-1 px-6">
          <div className="flex justify-center">
            <span className="w-14 h-14 flex items-center justify-center border-2 border-white rounded-full text-white font-bold mb-5 text-2xl">
              03
            </span>
          </div>
          <h3 className="text-white font-bold text-lg mb-3">
            Global community to inspire your journey
          </h3>
          <p className="text-white text-base font-medium opacity-90">
            We are building a global and diverse community of entrepreneurs. Booksy partners with world-renowned experts, educators and brands.
          </p>
        </ScrollFade>
      </div>

      {/* CTA Button */}
      <ScrollFade delay={800}>
        <button className="bg-white text-black font-semibold text-lg px-8 py-3 rounded-lg shadow-lg mt-8 hover:bg-teal-300 transition">
          Start free now
        </button>
      </ScrollFade>
    </ScrollFade>

    {/* Bottom Section */}
    <ScrollFade delay={1000} className="mt-16 text-center">
      <div className="text-gray-900 text-2xl lg:text-3xl font-bold">
        Change is hard.<br />
        We make it easy.
      </div>
    </ScrollFade>
  </div>
);

export default Qaulity;
