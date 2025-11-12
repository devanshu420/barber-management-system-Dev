"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaTiktok, FaYoutube, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const footerLinks = [
    {
      title: "BarberBook",
      links: ["All Features", "Who loves us", "Pricing", "Payments"],
    },
    {
      title: "",
      links: ["Blog", "About us", "Help Center", "Contact us"],
    },
    {
      title: "",
      links: ["Careers", "Comparison", "Make the Switch", "Book an appointment"],
    },
    {
      title: "",
      links: ["Terms of Use", "Privacy Policy"],
    },
  ];

  return (
    <footer className="relative bg-gradient-to-t from-black via-gray-900 to-gray-950 text-gray-300 pt-20 pb-8 w-full overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Columns Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 sm:px-12 mb-12">
          {footerLinks.map((col, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              {col.title && (
                <span className="text-white text-xl font-extrabold mb-8 block">
                  {col.title}
                </span>
              )}
              <ul
                className={`space-y-4 text-sm ${
                  col.title ? "" : "mt-8 md:mt-0"
                }`}
              >
                {col.links.map((link, i) => (
                  <motion.li
                    key={i}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a
                      href="#"
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <hr className="border-gray-700 my-8 max-w-6xl mx-auto px-6 sm:px-12" />

        {/* Bottom Bar */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-6 sm:px-12">
          {/* Social Icons */}
          <motion.div
            className="flex gap-6 text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {[
              { icon: FaInstagram, label: "Instagram" },
              { icon: FaTiktok, label: "TikTok" },
              { icon: FaYoutube, label: "YouTube" },
              { icon: FaLinkedin, label: "LinkedIn" },
            ].map(({ icon: Icon, label }, idx) => (
              <motion.a
                key={idx}
                href="#"
                whileHover={{ scale: 1.2, color: "#22d3ee" }}
                className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                aria-label={label}
              >
                <Icon size={22} />
              </motion.a>
            ))}
          </motion.div>

          {/* Language Selector */}
          <motion.div
            className="flex items-center gap-2 text-gray-400 cursor-pointer select-none hover:text-cyan-400 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src="https://flagcdn.com/in.svg"
              alt="India flag"
              className="w-5 h-4 rounded-sm"
            />
            <span className="text-base">India</span>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>

          {/* App Store Buttons */}
          <div className="flex gap-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              aria-label="Download on the App Store"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
                className="h-10 opacity-75 hover:opacity-100 transition-opacity duration-300"
              />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              aria-label="Get it on Google Play"
            >
              <img
                src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png"
                alt="Google Play"
                className="h-10 opacity-75 hover:opacity-100 transition-opacity duration-300"
              />
            </motion.a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-gray-500 text-sm px-6">
          <p>&copy; 2024 BarberBook. All rights reserved.</p>
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
        * {
          font-family: "Poppins", sans-serif;
        }
      `}</style>
    </footer>
  );
};

export default Footer;




// import React from 'react';
// import { FaInstagram, FaTiktok, FaYoutube, FaLinkedin } from 'react-icons/fa';

// const Footer = () => (
//   <footer className="bg-gradient-to-t from-black via-gray-900 to-gray-950 text-gray-400 pt-16 pb-7 w-full">
//     {/* Columns Section */}
//     <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6 sm:px-12">
//       <div>
//         <span className="text-white text-xl font-extrabold mb-7 block">BarberBook</span>
//         <ul className="space-y-3 text-sm">
//           <li><a href="#" className="hover:text-teal-400 transition">All Features</a></li>
//           <li><a href="#" className="hover:text-teal-400 transition">Who loves us</a></li>
//           <li><a href="#" className="hover:text-teal-400 transition">Pricing</a></li>
//           <li><a href="#" className="hover:text-teal-400 transition">Payments</a></li>
//         </ul>
//       </div>
//       <div>
//         <ul className="space-y-3 text-sm mt-7 md:mt-0">
//           <li><a href="#" className="hover:text-teal-400 transition">Blog</a></li>
//           <li><a href="#" className="hover:text-teal-400 transition">About us</a></li>
//           <li><a href="#" className="hover:text-teal-400 transition">Help Center</a></li>
//           <li><a href="#" className="hover:text-teal-400 transition">Contact us</a></li>
//         </ul>
//       </div>
//       <div>
//         <ul className="space-y-3 text-sm mt-7 md:mt-0">
//           <li><a href="#" className="hover:text-teal-400 transition">Careers</a></li>
//           <li><a href="#" className="hover:text-teal-400 transition">Comparison</a></li>
//           <li><a href="#" className="hover:text-teal-400 transition">Make the Switch</a></li>
//           <li><a href="#" className="hover:text-teal-400 transition">Book an appointment</a></li>
//         </ul>
//       </div>
//       <div>
//         <ul className="space-y-3 text-sm mt-7 md:mt-0">
//           <li><a href="#" className="hover:text-teal-400 transition">Terms of Use</a></li>
//           <li><a href="#" className="hover:text-teal-400 transition">Privacy Policy</a></li>
//         </ul>
//       </div>
//     </div>

//     {/* Divider */}
//     <hr className="border-gray-700 my-7 max-w-6xl mx-auto px-6 sm:px-12" />

//     {/* Bottom Bar */}
//     <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-y-6 px-6 sm:px-12">
//       {/* Social Icons */}
//       <div className="flex gap-5 text-gray-400">
//         <FaInstagram size={22} className="hover:text-teal-400 cursor-pointer transition" />
//         <FaTiktok size={22} className="hover:text-teal-400 cursor-pointer transition" />
//         <FaYoutube size={22} className="hover:text-teal-400 cursor-pointer transition" />
//         <FaLinkedin size={22} className="hover:text-teal-400 cursor-pointer transition" />
//       </div>
//       {/* Language Selector */}
//       <div className="flex items-center gap-2 text-gray-400 cursor-pointer select-none">
//         <img src="https://flagcdn.com/in.svg" alt="US flag" className="w-5 h-4 rounded-sm" />
//         <span className="text-base">India</span>
//         <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//         </svg>
//       </div>
//       {/* App Store Buttons */}
//       <div className="flex gap-4">
//         <a href="#" aria-label="Download on the App Store">
//           <img
//             src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
//             alt="App Store"
//             className="h-10"
//           />
//         </a>
//         <a href="#" aria-label="Get it on Google Play">
//           <img
//             src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png"
//             alt="Google Play"
//             className="h-10"
//           />
//         </a>
//       </div>
//     </div>
//   </footer>
// );

// export default Footer;
