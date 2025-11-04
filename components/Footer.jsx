import React from 'react';
import { FaInstagram, FaTiktok, FaYoutube, FaLinkedin } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-[#26282c] text-gray-300 pt-16 pb-7 w-full">
    {/* Columns Section */}
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <span className="text-white text-xl font-semibold mb-7 block">BarberBook</span>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-white">All Features</a></li>
          <li><a href="#" className="hover:text-white">Who loves us</a></li>
          <li><a href="#" className="hover:text-white">Pricing</a></li>
          <li><a href="#" className="hover:text-white">Payments</a></li>
        </ul>
      </div>
      <div>
        <ul className="space-y-2 text-sm mt-7 md:mt-0">
          <li><a href="#" className="hover:text-white">Blog</a></li>
          <li><a href="#" className="hover:text-white">About us</a></li>
          <li><a href="#" className="hover:text-white">Help Center</a></li>
          <li><a href="#" className="hover:text-white">Contact us</a></li>
        </ul>
      </div>
      <div>
        <ul className="space-y-2 text-sm mt-7 md:mt-0">
          <li><a href="#" className="hover:text-white">Careers</a></li>
          <li><a href="#" className="hover:text-white">Comparison</a></li>
          <li><a href="#" className="hover:text-white">Make the Switch</a></li>
          <li><a href="#" className="hover:text-white">Book an appointment</a></li>
        </ul>
      </div>
      <div>
        <ul className="space-y-2 text-sm mt-7 md:mt-0">
          <li><a href="#" className="hover:text-white">Terms of Use</a></li>
          <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
        </ul>
      </div>
    </div>

    {/* Divider */}
    <hr className="border-gray-700 my-7" />

    {/* Bottom Bar */}
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-y-6">
      {/* Social Icons */}
      <div className="flex gap-5">
        <FaInstagram size={22} className="hover:text-white cursor-pointer" />
        <FaTiktok size={22} className="hover:text-white cursor-pointer" />
        <FaYoutube size={22} className="hover:text-white cursor-pointer" />
        <FaLinkedin size={22} className="hover:text-white cursor-pointer" />
      </div>
      {/* Language Selector */}
      <div className="flex items-center gap-2">
        <img src="https://flagcdn.com/us.svg" alt="US flag" className="w-5 h-4 rounded-sm" />
        <span className="text-base">English (United States)</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {/* App Store Buttons */}
      <div className="flex gap-4">
        <a href="#"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-10" /></a>
        <a href="#"><img src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" alt="Google Play" className="h-10" /></a>
      </div>
    </div>
  </footer>
);

export default Footer;
