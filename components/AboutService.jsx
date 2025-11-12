"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";



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

const AboutService = () => {
  const features = [
    {
      image: "https://simplycontact.com/wp-content/uploads/2022/09/24_7-chat-support.webp",
      title: "💬 24/7 Live Chat",
      subtitle: "Chat directly with your barber to discuss styles, timings, or any special requests before your visit",
    },
    {
      image: "https://cilwo.com/wp-content/uploads/2023/03/3d-hand-holding-phone-with-reminder-push-notification-bell-design-illustration-vector.webp",
      title: "🔔 Smart Notifications & Reminders",
      subtitle: "Receive automatic alerts for upcoming appointments, exclusive offers, and new services.",
    },
    {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf82itV3OaXWeYmS3e2gz056DTmEh-amyzQA&s",
      title: "⭐ Customer Feedback & Ratings",
      subtitle: "Share your experience and help others choose the best barber while improving service quality.",
    },
    {
      image: "https://blog.nextbee.com/wp-content/uploads/2018/11/loyalty-reward.jpg",
      title: "🎁 Loyalty & Rewards Program",
      subtitle: "Earn points on every booking and redeem them for discounts, free grooming sessions, or premium upgrades.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-cyan-950 text-white overflow-hidden py-16 px-4 sm:px-12 lg:px-24">
   

      {/* Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-cyan-950/80 pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent"
        >
          Why Choose BarberBook?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {features.map((feature, index) => (
            <ScrollFade
              key={index}
              delay={index * 100}
              className="group"
            >
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-6 p-6 rounded-2xl bg-gray-900/50 border border-gray-800/50 hover:border-cyan-500/60 hover:shadow-cyan-400/20 transition-all duration-300 relative overflow-hidden"
              >
                {/* Neon Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-cyan-400 to-teal-500 opacity-10 blur-xl" />
                </div>

                <div className="relative z-10 w-28 h-28 flex-shrink-0">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full rounded-xl object-cover shadow-lg"
                  />
                </div>

                <div className="relative z-10">
                  <h3 className="font-bold text-xl text-cyan-300 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.subtitle}
                  </p>
                </div>
              </motion.div>
            </ScrollFade>
          ))}
        </div>

        {/* CTA Buttons */}
        <ScrollFade delay={400} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
          >
            Start Free Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 border-2 border-cyan-400 text-cyan-300 font-semibold rounded-lg hover:bg-cyan-500/10 transition-all duration-300"
          >
            Make the Switch
          </motion.button>
        </ScrollFade>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        * { font-family: "Poppins", sans-serif; }
        body, .cursor-none, .cursor-none * { cursor: none !important; }
      `}</style>
    </div>
  );
};

export default AboutService;

// import React, { useRef, useState, useEffect } from "react";

// const ScrollFade = ({ children, className = "" }) => {
//   const ref = useRef();
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//           observer.unobserve(ref.current);
//         }
//       },
//       { threshold: 0.1 }
//     );

//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, []);

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

// const AboutService = () => {
//   const features = [
//     {
//       image: "https://simplycontact.com/wp-content/uploads/2022/09/24_7-chat-support.webp",
//       title: "💬24/7 live chat",
//       subtitle: "Chat directly with your barber to discuss styles, timings, or any special requests before your visit",
//     },
//     {
//       image: "https://cilwo.com/wp-content/uploads/2023/03/3d-hand-holding-phone-with-reminder-push-notification-bell-design-illustration-vector.webp",
//       title: "🔔 Smart Notifications & Reminders",
//       subtitle: "Receive automatic alerts for upcoming appointments, exclusive offers, and new services.",
//     },
//     {
//       image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf82itV3OaXWeYmS3e2gz056DTmEh-amyzQA&s",
//       title: "⭐ Customer Feedback & Ratings",
//       subtitle: "Share your experience and help others choose the best barber while improving service quality.",
//     },
//     {
//       image: "https://blog.nextbee.com/wp-content/uploads/2018/11/loyalty-reward.jpg",
//       title: "🎁 Loyalty & Rewards Program",
//       subtitle: "Earn points on every booking and redeem them for discounts, free grooming sessions, or premium upgrades.",
//     },
//   ];

//   return (
//     <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black min-h-screen flex flex-col items-center pt-10 py-10 px-4 sm:px-12 lg:px-24">
//       <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14 mb-12">
//         {features.map((feature, index) => (
//           <ScrollFade key={index} className="flex items-center border-b border-gray-700 pb-8">
//             <img
//               src={feature.image}
//               alt=""
//               className="w-32 h-32 rounded-lg object-cover mr-8 shadow-lg"
//             />
//             <div>
//               <h3 className="font-extrabold text-2xl text-teal-400 mb-2">{feature.title}</h3>
//               <span className="text-gray-400 text-sm">{feature.subtitle}</span>
//             </div>
//           </ScrollFade>
//         ))}
//       </div>

//       {/* Action Buttons */}
//       <ScrollFade className="flex gap-6 mt-6">
//         <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-md font-semibold shadow-lg transition">
//           Start free now
//         </button>
//         <button className="border-2 border-teal-600 text-teal-600 px-8 py-3 rounded-md font-semibold shadow hover:bg-teal-700 hover:text-white transition">
//           Make the Switch
//         </button>
//       </ScrollFade>
//     </div>
//   );
// };

// export default AboutService;
