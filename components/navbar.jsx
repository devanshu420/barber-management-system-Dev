"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Scissors,
  Wallet,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Barbers", href: "/barbers" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Bookings", href: "/bookings" },
  ];

  // 🔹 Load login state from localStorage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userNameStored = localStorage.getItem("userName");
      setIsAuthenticated(!!token);
      setUserName(userNameStored || "User");
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔹 Handle logout
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      setIsAuthenticated(false);
      setUserName("");
      setIsMenuOpen(false);
      setIsProfileOpen(false);
      router.push("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // 🔹 Handle Sign In Navigation
  const handleSignIn = () => {
    setIsMenuOpen(false);
    router.push("/auth/login");
  };

  // 🔹 Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <nav className="bg-gradient-to-r from-gray-900 via-gray-950 to-black text-gray-200 shadow-2xl sticky top-0 z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-teal-500/20 rounded-lg group-hover:bg-teal-500/30 transition">
                <Scissors className="h-6 w-6 text-teal-400" />
              </div>
              <span className="text-white font-bold text-lg hidden sm:block">
                BarberBook
              </span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-950 to-black text-gray-200 shadow-2xl sticky top-0 z-50 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 🔹 Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group flex-shrink-0"
          >
            <div className="p-2 bg-teal-500/20 rounded-lg group-hover:bg-teal-500/30 transition duration-300">
              <Scissors className="h-6 w-6 text-teal-400" />
            </div>
            <span className="text-white font-bold text-lg hidden sm:block group-hover:text-teal-400 transition">
              BarberBook
            </span>
          </Link>

          {/* 🔹 Desktop Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <span className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-teal-400 hover:bg-gray-800/50 transition duration-300 ease-in-out cursor-pointer">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>

          {/* 🔹 Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* Wallet Button */}
                <Link href="/payment">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-teal-400 hover:bg-gray-800/50 transition duration-300 cursor-pointer"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Wallet</span>
                  </Button>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-800/50 transition duration-300 group cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-xs font-bold text-black">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-300 hidden sm:block group-hover:text-teal-400">
                      {userName}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition duration-300 ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl py-2 animate-fadeIn">
                      <Link href="/dashboard/customer">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-teal-400 hover:bg-gray-800/50 flex items-center space-x-2 transition cursor-pointer">
                          <User className="w-4 h-4" />
                          <span>Dashboard</span>
                        </button>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-gray-800/50 flex items-center space-x-2 transition border-t border-gray-800 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Button
                onClick={handleSignIn}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 cursor-pointer"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* 🔹 Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-800/50 transition cursor-pointer"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-teal-400" />
            ) : (
              <Menu className="h-6 w-6 text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* 🔹 Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-800 shadow-2xl animate-slideDown">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-teal-400 hover:bg-gray-800 transition cursor-pointer">
                  {link.name}
                </span>
              </Link>
            ))}

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-800 pt-3 mt-3 space-y-2">
              {isAuthenticated ? (
                <>
                  {/* User Profile Card */}
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-sm font-bold text-black">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-200">
                        {userName}
                      </span>
                    </div>
                  </div>

                  {/* Wallet Link */}
                  {/* <Link
                    href="/payment"
                    onClick={() => setIsMenuOpen(false)}
                    className="block"
                  >
                    <button className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-teal-400 hover:bg-gray-800 transition flex items-center space-x-2 cursor-pointer">
                      <Wallet className="w-5 h-5" />
                      <span>Wallet</span>
                    </button>
                  </Link> */}

                  {/* Dashboard Link */}
                  <Link
                    href="/dashboard/customer"
                    onClick={() => setIsMenuOpen(false)}
                    className="block"
                  >
                    <button className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-teal-400 hover:bg-gray-800 transition flex items-center space-x-2 cursor-pointer">
                      <User className="w-5 h-5" />
                      <span>Dashboard</span>
                    </button>
                  </Link>

                  {/* Sign Out Button */}
                  <button
                    onClick={() => {
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-red-400 hover:bg-gray-800 transition flex items-center space-x-2 border-t border-gray-800 cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold py-2 rounded-lg shadow-lg transition cursor-pointer"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </nav>
  );
}



