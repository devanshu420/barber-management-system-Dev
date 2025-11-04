import React, { useRef, useState, useEffect } from "react";
import { BadgeCheck } from "lucide-react";

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

const BussinessRelation = () => {
  const features = [
    "Easy, seamless booking for clients",
    "Automated client engagement tools",
    "Keep client notes for a personal touch",
    "Appointment reminders",
    "Reward loyal clients",
  ];

  return (
    <section className="bg-white min-h-screen flex flex-col justify-center">
      <div className="w-full max-w-4xl mx-auto py-20 px-6 md:px-16 lg:px-24">
        {/* Title */}
        <ScrollFade className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug">
            Your business is built on relationships.
            <br />
            <span className="text-gray-900">We help you nurture them.</span>
          </h2>
        </ScrollFade>

        {/* Content */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-14">
          {/* Left Side - Features */}
          <div className="flex-1 space-y-6 w-full max-w-md">
            {features.map((feature, index) => (
              <ScrollFade key={index} delay={index * 150} className="flex items-start space-x-3">
                <BadgeCheck className="text-gray-700 w-6 h-6 flex-shrink-0 mt-1" />
                <p className="text-gray-700 text-base font-medium border-b border-gray-200 pb-4 w-full">
                  {feature}
                </p>
              </ScrollFade>
            ))}

            <ScrollFade delay={features.length * 150} className="mt-6">
              <button className="bg-gray-900 text-white font-semibold px-7 py-3 rounded-md hover:bg-gray-800 transition">
                Start free now
              </button>
            </ScrollFade>
          </div>

          {/* Right Side - Phone Image */}
          <ScrollFade delay={300} className="flex-1 flex justify-center items-center min-w-[320px]">
            <div className="relative flex items-center">
              {/* Pink background box */}
              <div className="absolute rounded-xl bg-pink-200 w-[300px] h-[400px] left-8 top-8 -z-10"></div>
              {/* Phone image */}
              <img
                src="https://cdn.prod.website-files.com/65ce807a7f0051db5b622a45/66a32af309fe379e771fb55d_Reviews.avif"
                alt="App mockup"
                className="w-[260px] md:w-[310px] rounded-[2rem] shadow-xl"
                style={{ position: "relative" }}
              />
            </div>
          </ScrollFade>
        </div>
      </div>
    </section>
  );
};

export default BussinessRelation;
