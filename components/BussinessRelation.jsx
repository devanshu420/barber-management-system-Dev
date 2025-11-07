"use client";

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
    "Empowering local barbers to grow their business digitally",
    "Helping salons reach more clients through our smart booking system",
    "Building long-term trust between customers and skilled barbers",
    "Providing growth tools and analytics to boost productivity",
    "Creating new opportunities for barbers to earn and expand",
  ];

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-950 to-black min-h-screen flex flex-col justify-center py-20 px-6 md:px-16 lg:px-24">
      <div className="w-full max-w-4xl mx-auto">
        {/* Section Header */}
        <ScrollFade className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-snug">
            We grow together —
            <br />
            <span className="text-teal-400">Barbers and BarberBook.</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            At BarberBook, we believe success comes when our barbers and our
            brand rise together. Our tools and platform are designed to help
            barbers in Indore build their presence, attract clients, and grow
            stronger every day.
          </p>
        </ScrollFade>

        {/* Content */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-14">
          {/* Left Side - Features */}
          <div className="flex-1 space-y-8 w-full max-w-md">
            {features.map((feature, index) => (
              <ScrollFade
                key={index}
                delay={index * 150}
                className="flex items-start space-x-3"
              >
                <BadgeCheck className="text-teal-400 w-6 h-6 flex-shrink-0 mt-1" />
                <p className="text-gray-300 text-base font-medium border-b border-gray-700 pb-4 w-full">
                  {feature}
                </p>
              </ScrollFade>
            ))}

            <ScrollFade delay={features.length * 150} className="mt-6">
              <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-md shadow-lg transition duration-300">
                Join the Growth Journey
              </button>
            </ScrollFade>
          </div>

          {/* Right Side - Indian Barber Image */}
          <ScrollFade delay={300} className="flex-1 flex justify-center items-center min-w-[320px]">
            <div className="relative flex items-center">
              <div className="absolute rounded-xl bg-teal-900 w-[300px] h-[400px] left-8 top-8 -z-10 shadow-lg"></div>
              <img
                src="https://www.milady.com/wp-content/uploads/2023/09/Barbering-opportunities-abound.jpg"
                alt="Indian barber working with client"
                className="w-[260px] md:w-[310px] rounded-[2rem] shadow-2xl border border-teal-700 object-cover"
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
