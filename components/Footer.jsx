import React from 'react';
import { FaInstagram, FaTiktok, FaYoutube, FaLinkedin } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-gradient-to-t from-black via-gray-900 to-gray-950 text-gray-400 pt-16 pb-7 w-full">
    {/* Columns Section */}
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6 sm:px-12">
      <div>
        <span className="text-white text-xl font-extrabold mb-7 block">BarberBook</span>
        <ul className="space-y-3 text-sm">
          <li><a href="#" className="hover:text-teal-400 transition">All Features</a></li>
          <li><a href="#" className="hover:text-teal-400 transition">Who loves us</a></li>
          <li><a href="#" className="hover:text-teal-400 transition">Pricing</a></li>
          <li><a href="#" className="hover:text-teal-400 transition">Payments</a></li>
        </ul>
      </div>
      <div>
        <ul className="space-y-3 text-sm mt-7 md:mt-0">
          <li><a href="#" className="hover:text-teal-400 transition">Blog</a></li>
          <li><a href="#" className="hover:text-teal-400 transition">About us</a></li>
          <li><a href="#" className="hover:text-teal-400 transition">Help Center</a></li>
          <li><a href="#" className="hover:text-teal-400 transition">Contact us</a></li>
        </ul>
      </div>
      <div>
        <ul className="space-y-3 text-sm mt-7 md:mt-0">
          <li><a href="#" className="hover:text-teal-400 transition">Careers</a></li>
          <li><a href="#" className="hover:text-teal-400 transition">Comparison</a></li>
          <li><a href="#" className="hover:text-teal-400 transition">Make the Switch</a></li>
          <li><a href="#" className="hover:text-teal-400 transition">Book an appointment</a></li>
        </ul>
      </div>
      <div>
        <ul className="space-y-3 text-sm mt-7 md:mt-0">
          <li><a href="#" className="hover:text-teal-400 transition">Terms of Use</a></li>
          <li><a href="#" className="hover:text-teal-400 transition">Privacy Policy</a></li>
        </ul>
      </div>
    </div>

    {/* Divider */}
    <hr className="border-gray-700 my-7 max-w-6xl mx-auto px-6 sm:px-12" />

    {/* Bottom Bar */}
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-y-6 px-6 sm:px-12">
      {/* Social Icons */}
      <div className="flex gap-5 text-gray-400">
        <FaInstagram size={22} className="hover:text-teal-400 cursor-pointer transition" />
        <FaTiktok size={22} className="hover:text-teal-400 cursor-pointer transition" />
        <FaYoutube size={22} className="hover:text-teal-400 cursor-pointer transition" />
        <FaLinkedin size={22} className="hover:text-teal-400 cursor-pointer transition" />
      </div>
      {/* Language Selector */}
      <div className="flex items-center gap-2 text-gray-400 cursor-pointer select-none">
        <img src="https://flagcdn.com/in.svg" alt="US flag" className="w-5 h-4 rounded-sm" />
        <span className="text-base">India</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {/* App Store Buttons */}
      <div className="flex gap-4">
        <a href="#" aria-label="Download on the App Store">
          <img
            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
            alt="App Store"
            className="h-10"
          />
        </a>
        <a href="#" aria-label="Get it on Google Play">
          <img
            src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png"
            alt="Google Play"
            className="h-10"
          />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
