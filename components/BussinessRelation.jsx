"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";

// Custom Futuristic Cursor


// Scroll Fade Component
const ScrollFade = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
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

const BusinessRelation = () => {
  const features = [
    "Empowering local barbers to grow their business digitally",
    "Helping salons reach more clients through our smart booking system",
    "Building long-term trust between customers and skilled barbers",
    "Providing growth tools and analytics to boost productivity",
    "Creating new opportunities for barbers to earn and expand",
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-cyan-950 text-white overflow-hidden flex flex-col justify-center py-20 px-6 md:px-16 lg:px-24">
    

      {/* Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-cyan-950/80 pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <ScrollFade className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-snug mb-4">
            We grow together —
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400">
              Barbers and BarberBook.
            </span>
          </h2>
          <p className="text-gray-300 mt-6 max-w-2xl mx-auto text-lg">
            At BarberBook, we believe success comes when our barbers and our
            brand rise together. Our tools and platform are designed to help
            barbers in Indore build their presence, attract clients, and grow
            stronger every day.
          </p>
        </ScrollFade>

        {/* Content */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-16">
          {/* Left Side - Features */}
          <div className="flex-1 space-y-8 w-full max-w-md">
            {features.map((feature, index) => (
              <ScrollFade
                key={index}
                delay={index * 150}
                className="group"
              >
                <motion.div
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-gray-900/40 border border-gray-800/50 hover:border-cyan-500/40 transition-all duration-300"
                >
                  <BadgeCheck className="text-cyan-400 w-6 h-6 flex-shrink-0 mt-1" />
                  <p className="text-gray-300 text-base font-medium">
                    {feature}
                  </p>
                </motion.div>
              </ScrollFade>
            ))}

            <ScrollFade delay={features.length * 150} className="mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-black font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
              >
                Join the Growth Journey
              </motion.button>
            </ScrollFade>
          </div>

          {/* Right Side - Image */}
          <ScrollFade delay={300} className="flex-1 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="absolute rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 w-[300px] h-[400px] left-6 top-6 -z-10 shadow-2xl" />
              <img
                src="https://www.milady.com/wp-content/uploads/2023/09/Barbering-opportunities-abound.jpg"
                alt="Indian barber working with client"
                className="w-[260px] md:w-[310px] rounded-2xl shadow-2xl border-2 border-cyan-400/30 object-cover hover:border-cyan-400/60 transition-all duration-300"
              />
            </motion.div>
          </ScrollFade>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        * { font-family: "Poppins", sans-serif; }
        body, .cursor-none, .cursor-none * { cursor: none !important; }
      `}</style>
    </section>
  );
};

export default BusinessRelation;

// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import { BadgeCheck } from "lucide-react";

// // Reusable scroll fade component
// const ScrollFade = ({ children, className = "", delay = 0 }) => {
//   const ref = useRef();
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setTimeout(() => setVisible(true), delay);
//           observer.unobserve(ref.current);
//         }
//       },
//       { threshold: 0.1 }
//     );

//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [delay]);

//   return (
//     <div
//       ref={ref}
//       className={`${className} transition-all duration-700 ease-out transform ${
//         visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
//       }`}
//     >
//       {children}
//     </div>
//   );
// };

// const BussinessRelation = () => {
//   const features = [
//     "Empowering local barbers to grow their business digitally",
//     "Helping salons reach more clients through our smart booking system",
//     "Building long-term trust between customers and skilled barbers",
//     "Providing growth tools and analytics to boost productivity",
//     "Creating new opportunities for barbers to earn and expand",
//   ];

//   return (
//     <section className="bg-gradient-to-br from-gray-900 via-gray-950 to-black min-h-screen flex flex-col justify-center py-20 px-6 md:px-16 lg:px-24">
//       <div className="w-full max-w-4xl mx-auto">
//         {/* Section Header */}
//         <ScrollFade className="text-center mb-14">
//           <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-snug">
//             We grow together —
//             <br />
//             <span className="text-teal-400">Barbers and BarberBook.</span>
//           </h2>
//           <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
//             At BarberBook, we believe success comes when our barbers and our
//             brand rise together. Our tools and platform are designed to help
//             barbers in Indore build their presence, attract clients, and grow
//             stronger every day.
//           </p>
//         </ScrollFade>

//         {/* Content */}
//         <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-14">
//           {/* Left Side - Features */}
//           <div className="flex-1 space-y-8 w-full max-w-md">
//             {features.map((feature, index) => (
//               <ScrollFade
//                 key={index}
//                 delay={index * 150}
//                 className="flex items-start space-x-3"
//               >
//                 <BadgeCheck className="text-teal-400 w-6 h-6 flex-shrink-0 mt-1" />
//                 <p className="text-gray-300 text-base font-medium border-b border-gray-700 pb-4 w-full">
//                   {feature}
//                 </p>
//               </ScrollFade>
//             ))}

//             <ScrollFade delay={features.length * 150} className="mt-6">
//               <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-md shadow-lg transition duration-300">
//                 Join the Growth Journey
//               </button>
//             </ScrollFade>
//           </div>

//           {/* Right Side - Indian Barber Image */}
//           <ScrollFade delay={300} className="flex-1 flex justify-center items-center min-w-[320px]">
//             <div className="relative flex items-center">
//               <div className="absolute rounded-xl bg-teal-900 w-[300px] h-[400px] left-8 top-8 -z-10 shadow-lg"></div>
//               <img
//                 src="https://www.milady.com/wp-content/uploads/2023/09/Barbering-opportunities-abound.jpg"
//                 alt="Indian barber working with client"
//                 className="w-[260px] md:w-[310px] rounded-[2rem] shadow-2xl border border-teal-700 object-cover"
//                 style={{ position: "relative" }}
//               />
//             </div>
//           </ScrollFade>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BussinessRelation;
