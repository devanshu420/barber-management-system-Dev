"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Scissors,
  LogOut,
  ArrowLeft,
  Edit,
  Shield,
  Calendar,
  Star,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function CustomerDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [updating, setUpdating] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://barber-book-155830263049.asia-south1.run.app";

  // Fetch user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

        if (!token) {
          router.push("/auth/login");
          return;
        }

        const { data } = await axios.get(
          `${API_BASE_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Backend: { success: true, data: { ...user } }
        if (!data?.success || !data?.data) {
          console.error("Profile API returned invalid data:", data);
          return;
        }

        const user = data.data;

        setUserData({
          ...user,
          bookings:
            user.bookings ?? user.totalBookings ?? 0,
          reviews:
            user.reviews ?? user.totalReviews ?? 0,
          walletBalance: user.walletBalance ?? 0,
          loyaltyPoints: user.loyaltyPoints ?? 0,
          lastBookingAt: user.lastBookingAt
            ? new Date(user.lastBookingAt).toLocaleString()
            : null,
          joinDate: user.joinDate
            ? new Date(user.joinDate).toLocaleDateString()
            : new Date().toLocaleDateString(),
        });

        // Initialize edit form
        setEditName(user.name || "");
        setEditEmail(user.email || "");
        setEditPhone(user.phone || "");
        setProfilePhotoPreview(user.profilePhoto || null);

        // Cache basic info in localStorage if you want
        localStorage.setItem("userName", user.name || "");
        localStorage.setItem("userEmail", user.email || "");
        localStorage.setItem("userPhone", user.phone || "");
        localStorage.setItem(
          "userBookings",
          String(
            user.bookings ?? user.totalBookings ?? 0
          )
        );
        if (user.profilePhoto) {
          localStorage.setItem(
            "userProfilePhoto",
            user.profilePhoto
          );
        }
        if (user._id || user.id) {
          localStorage.setItem(
            "userId",
            user._id || user.id
          );
        }
      } catch (error) {
        const status = error?.response?.status;
        console.error("Error fetching profile:", {
          message: error?.message,
          status,
          data: error?.response?.data,
        });

        // Sirf 401 pe token clear karke login page
        if (status === 401) {
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API_BASE_URL, router]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPhone");
      localStorage.removeItem("userBookings");
      localStorage.removeItem("userProfilePhoto");
      localStorage.removeItem("userId");
      router.push("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfilePhotoFile(file);
    const url = URL.createObjectURL(file);
    setProfilePhotoPreview(url);
  };

  const handleProfileUpdate = async () => {
    try {
      setUpdating(true);
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      if (!token) {
        router.push("/auth/login");
        return;
      }

      const formData = new FormData();
      formData.append("name", editName);
      formData.append("email", editEmail);
      formData.append("phone", editPhone);
      if (profilePhotoFile) {
        formData.append("profilePhoto", profilePhotoFile);
      }

      const { data } = await axios.put(
        `${API_BASE_URL}/api/users/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        const updated = data.user || data.data;

        // Update localStorage cache
        localStorage.setItem("userName", updated.name);
        localStorage.setItem("userEmail", updated.email);
        localStorage.setItem("userPhone", updated.phone);
        if (updated.profilePhoto) {
          localStorage.setItem(
            "userProfilePhoto",
            updated.profilePhoto
          );
        }

        // Update state from backend response
        setUserData((prev) => ({
          ...prev,
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          profilePhoto:
            updated.profilePhoto || prev.profilePhoto,
          isEmailVerified: updated.isEmailVerified,
          isPhoneVerified: updated.isPhoneVerified,
        }));

        setIsEditing(false);
        setProfilePhotoFile(null);
        setProfilePhotoPreview(
          updated.profilePhoto || null
        );

        alert("Profile updated successfully");
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      const msg =
        error?.response?.data?.message ||
        "Failed to update profile. Please try again.";
      alert(msg);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-500/20 mb-4">
            <Scissors className="w-6 h-6 text-teal-400 animate-spin" />
          </div>
          <p className="text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Unable to load user data
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-teal-500 hover:bg-teal-600"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const avatarContent = userData.profilePhoto ? (
    <img
      src={profilePhotoPreview || userData.profilePhoto}
      alt={userData.name}
      className="w-full h-full object-cover rounded-2xl"
    />
  ) : (
    <span className="text-4xl font-bold text-black">
      {userData.name?.charAt(0).toUpperCase()}
    </span>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-950 text-white py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-teal-400 hover:bg-gray-800/50"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-teal-400">
                Customer
              </p>
              <h1 className="text-3xl sm:text-4xl font-semibold mt-1">
                Dashboard
              </h1>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            className="bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/50 text-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Top: profile + stats */}
        <div className="grid grid-cols-1 lg:grid-cols-[2.1fr,1fr] gap-6">
          {/* Profile card */}
          <div className="bg-gradient-to-br from-slate-900/70 to-slate-950/70 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.85)]">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0 flex flex-col items-center relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/40 overflow-hidden">
                  {avatarContent}
                </div>

                {isEditing ? (
                  <>
                    <label className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-xs text-slate-200 cursor-pointer hover:border-teal-400">
                      <Camera className="w-4 h-4 text-teal-400" />
                      <span>Change photo</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </label>
                    <p className="mt-1 text-[11px] text-slate-500 text-center">
                      JPG, PNG or WEBP. Max 5MB.
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-xs text-slate-400">
                    Member since {userData.joinDate}
                  </p>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between gap-4">
                  <div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-semibold">
                          Full name
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) =>
                            setEditName(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/70 border border-slate-700 text-sm outline-none focus:ring-1 focus:ring-teal-400"
                          placeholder="Enter your name"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl sm:text-3xl font-semibold">
                          {userData.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Shield className="w-4 h-4 text-teal-400" />
                          <span className="text-sm text-teal-300 capitalize font-medium">
                            {userData.role}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="h-9 bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/40 text-xs sm:text-sm"
                    >
                      <Edit className="w-4 h-4 mr-1.5" />
                      Edit Profile
                    </Button>
                  )}
                </div>

                {/* Verification chips */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-emerald-300">
                      Email{" "}
                      {userData.isEmailVerified
                        ? "verified"
                        : "pending"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-emerald-300">
                      Phone{" "}
                      {userData.isPhoneVerified
                        ? "verified"
                        : "pending"}
                    </span>
                  </div>
                </div>

                {/* Contact row */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 border-t border-slate-800/80 mt-2">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-400 font-semibold">
                          Email
                        </label>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-teal-400" />
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) =>
                              setEditEmail(e.target.value)
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-700 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-teal-400"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Mail className="w-4 h-4 text-teal-400" />
                        <span className="text-slate-300 break-all">
                          {userData.email}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-400 font-semibold">
                          Phone
                        </label>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-teal-400" />
                          <input
                            type="tel"
                            value={editPhone}
                            onChange={(e) =>
                              setEditPhone(e.target.value)
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-700 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-teal-400"
                            placeholder="10-digit number"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Phone className="w-4 h-4 text-teal-400" />
                        <span className="text-slate-300">
                          {userData.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Save / Cancel buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-3">
                    <Button
                      disabled={updating}
                      onClick={handleProfileUpdate}
                      className="bg-teal-500 hover:bg-teal-600 text-black text-sm px-5"
                    >
                      {updating
                        ? "Saving..."
                        : "Save changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={updating}
                      onClick={() => {
                        setIsEditing(false);
                        setEditName(userData.name || "");
                        setEditEmail(
                          userData.email || ""
                        );
                        setEditPhone(
                          userData.phone || ""
                        );
                        setProfilePhotoFile(null);
                        setProfilePhotoPreview(
                          userData.profilePhoto || null
                        );
                      }}
                      className="border-slate-700 text-slate-300 text-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Compact stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Total bookings
                </span>
                <Calendar className="w-5 h-5 text-teal-400/60" />
              </div>
              <p className="mt-3 text-3xl font-semibold">
                {userData.bookings}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Keep your grooming on schedule.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Reviews
                </span>
                <Star className="w-5 h-5 text-yellow-400/70" />
              </div>
              <p className="mt-3 text-3xl font-semibold">
                {userData.reviews}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Share feedback to help your barbers.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: contact + account sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Contact information */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-7 shadow-[0_16px_40px_rgba(15,23,42,0.75)]">
            <h3 className="text-xl sm:text-2xl font-semibold mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-400" />
              <span>Contact information</span>
            </h3>

            <div className="space-y-5 text-sm">
              <div>
                <label className="text-slate-400 text-xs font-semibold">
                  Email address
                </label>
                <div className="mt-2 flex items-center gap-3 px-3.5 py-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <Mail className="w-4 h-4 text-teal-400" />
                  <span className="text-slate-100 break-all">
                    {userData.email}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs font-semibold">
                  Phone number
                </label>
                <div className="mt-2 flex items-center gap-3 px-3.5 py-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <Phone className="w-4 h-4 text-teal-400" />
                  <span className="text-slate-100">
                    {userData.phone}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs font-semibold">
                  Account type
                </label>
                <div className="mt-2 flex items-center gap-3 px-3.5 py-3 rounded-xl bg-teal-500/10 border border-teal-500/30">
                  <Scissors className="w-4 h-4 text-teal-300" />
                  <span className="text-teal-200 capitalize font-medium">
                    {userData.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account overview */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-7 shadow-[0_16px_40px_rgba(15,23,42,0.75)]">
            <h3 className="text-xl sm:text-2xl font-semibold mb-5">
              Account overview
            </h3>

            <div className="space-y-5 text-sm">
              <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-slate-900/60">
                <span className="text-slate-400">
                  Member since
                </span>
                <span className="text-slate-100 font-medium">
                  {userData.joinDate}
                </span>
              </div>

              {userData.lastBookingAt && (
                <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-slate-900/60">
                  <span className="text-slate-400">
                    Last booking
                  </span>
                  <span className="text-slate-100 font-medium">
                    {userData.lastBookingAt}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-slate-900/60">
                <span className="text-slate-400">
                  Total bookings
                </span>
                <span className="text-teal-300 font-semibold">
                  {userData.bookings}
                </span>
              </div>

              <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-slate-900/60">
                <span className="text-slate-400">
                  Reviews given
                </span>
                <span className="text-yellow-300 font-semibold">
                  {userData.reviews}
                </span>
              </div>

              {typeof userData.walletBalance !==
                "undefined" && (
                <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-slate-300">
                    Wallet balance
                  </span>
                  <span className="text-emerald-300 font-semibold">
                    ₹{userData.walletBalance}
                  </span>
                </div>
              )}

              {typeof userData.loyaltyPoints !==
                "undefined" && (
                <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <span className="text-slate-300">
                    Loyalty points
                  </span>
                  <span className="text-purple-300 font-semibold">
                    {userData.loyaltyPoints}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/30">
                <span className="text-slate-300">
                  Your rating
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 4
                          ? "text-orange-400 fill-orange-400"
                          : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/booking">
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-3 rounded-xl transition-transform hover:scale-[1.03]">
              Book new appointment
            </Button>
          </Link>
          <Link href="/my-booking">
            <Button className="w-full bg-teal-500 hover:bg-teal-600 text-black font-semibold py-3 rounded-xl transition-transform hover:scale-[1.03]">
              View bookings
            </Button>
          </Link>
          <Link href="/payment">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-transform hover:scale-[1.03]">
              Manage payments
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            className="w-full bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/50 font-semibold py-3 rounded-xl transition-transform hover:scale-[1.03]"
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}








// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   User,
//   Mail,
//   Phone,
//   Scissors,
//   LogOut,
//   ArrowLeft,
//   Edit,
//   Shield,
//   Calendar,
//   Star,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function CustomerDashboard() {
//   const router = useRouter();
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     try {
//       const token = localStorage.getItem("token");
//       const userName = localStorage.getItem("userName");
//       const userRole = localStorage.getItem("userRole");
//       const booking = localStorage.getItem("userBookings") || 0;

//       if (!token) {
//         router.push("/auth/login");
//         return;
//       }

//       setUserData({
//         name: userName,
//         role: userRole,
//         email: localStorage.getItem("userEmail") || "user@example.com",
//         phone: localStorage.getItem("userPhone") || "+91 9876543210",
//         profilePhoto: null,
//         walletBalance: 500,
//         loyaltyPoints: 250,
//         isEmailVerified: true,
//         isPhoneVerified: true,
//         joinDate: new Date().toLocaleDateString(),
//         bookings: booking,
//         reviews: 8,
//       });
//     } catch (error) {
//       console.error("Error loading user data:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [router]);

//   const handleLogout = () => {
//     try {
//       localStorage.removeItem("token");
//       localStorage.removeItem("userName");
//       localStorage.removeItem("userRole");
//       localStorage.removeItem("userEmail");
//       localStorage.removeItem("userPhone");
//       localStorage.removeItem("userBookings");
//       router.push("/");
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-500/20 mb-4">
//             <Scissors className="w-6 h-6 text-teal-400 animate-spin" />
//           </div>
//           <p className="text-gray-400">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!userData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-400 mb-4">Unable to load user data</p>
//           <Button
//             onClick={() => router.push("/")}
//             className="bg-teal-500 hover:bg-teal-600"
//           >
//             Go Home
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-950 text-white py-10 px-4 sm:px-6 lg:px-10">
//       <div className="max-w-6xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Link href="/">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="text-gray-400 hover:text-teal-400 hover:bg-gray-800/50"
//               >
//                 <ArrowLeft className="w-5 h-5" />
//               </Button>
//             </Link>
//             <div>
//               <p className="text-xs uppercase tracking-[0.2em] text-teal-400">
//                 Customer
//               </p>
//               <h1 className="text-3xl sm:text-4xl font-semibold mt-1">
//                 Dashboard
//               </h1>
//             </div>
//           </div>

//           <Button
//             onClick={handleLogout}
//             className="bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/50 text-sm"
//           >
//             <LogOut className="w-4 h-4 mr-2" />
//             Sign Out
//           </Button>
//         </div>

//         {/* Top: profile + stats */}
//         <div className="grid grid-cols-1 lg:grid-cols-[2.1fr,1fr] gap-6">
//           {/* Profile card */}
//           <div className="bg-gradient-to-br from-slate-900/70 to-slate-950/70 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.85)]">
//             <div className="flex flex-col md:flex-row gap-6 md:gap-8">
//               {/* Avatar */}
//               <div className="flex-shrink-0 flex flex-col items-center">
//                 <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center text-4xl font-bold text-black shadow-lg shadow-teal-500/40">
//                   {userData.name?.charAt(0).toUpperCase()}
//                 </div>
//                 <p className="mt-3 text-xs text-slate-400">
//                   Member since {userData.joinDate}
//                 </p>
//               </div>

//               {/* Info */}
//               <div className="flex-1 space-y-4">
//                 <div className="flex justify-between gap-4">
//                   <div>
//                     <h2 className="text-2xl sm:text-3xl font-semibold">
//                       {userData.name}
//                     </h2>
//                     <div className="flex items-center gap-2 mt-1.5">
//                       <Shield className="w-4 h-4 text-teal-400" />
//                       <span className="text-sm text-teal-300 capitalize font-medium">
//                         {userData.role}
//                       </span>
//                     </div>
//                   </div>

//                   <Button
//                     onClick={() => setIsEditing(!isEditing)}
//                     className="h-9 bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/40 text-xs sm:text-sm"
//                   >
//                     <Edit className="w-4 h-4 mr-1.5" />
//                     Edit Profile
//                   </Button>
//                 </div>

//                 {/* Verification chips */}
//                 <div className="flex flex-wrap gap-3">
//                   <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40">
//                     <span className="w-2 h-2 rounded-full bg-emerald-400" />
//                     <span className="text-xs text-emerald-300">
//                       Email verified
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40">
//                     <span className="w-2 h-2 rounded-full bg-emerald-400" />
//                     <span className="text-xs text-emerald-300">
//                       Phone verified
//                     </span>
//                   </div>
//                 </div>

//                 {/* Contact inline row */}
//                 <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 border-t border-slate-800/80 mt-2">
//                   <div className="flex items-center gap-2 text-xs sm:text-sm">
//                     <Mail className="w-4 h-4 text-teal-400" />
//                     <span className="text-slate-300 break-all">
//                       {userData.email}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2 text-xs sm:text-sm">
//                     <Phone className="w-4 h-4 text-teal-400" />
//                     <span className="text-slate-300">{userData.phone}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Compact stats */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
//               <div className="flex items-center justify-between">
//                 <span className="text-xs text-slate-400">Total bookings</span>
//                 <Calendar className="w-5 h-5 text-teal-400/60" />
//               </div>
//               <p className="mt-3 text-3xl font-semibold">
//                 {userData.bookings}
//               </p>
//               <p className="mt-1 text-[11px] text-slate-500">
//                 Keep your grooming on schedule.
//               </p>
//             </div>

//             <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
//               <div className="flex items-center justify-between">
//                 <span className="text-xs text-slate-400">Reviews</span>
//                 <Star className="w-5 h-5 text-yellow-400/70" />
//               </div>
//               <p className="mt-3 text-3xl font-semibold">
//                 {userData.reviews}
//               </p>
//               <p className="mt-1 text-[11px] text-slate-500">
//                 Share feedback to help your barbers.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Bottom: contact + account sections */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Contact information */}
//           <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-7 shadow-[0_16px_40px_rgba(15,23,42,0.75)]">
//             <h3 className="text-xl sm:text-2xl font-semibold mb-5 flex items-center gap-2">
//               <User className="w-5 h-5 text-teal-400" />
//               <span>Contact information</span>
//             </h3>

//             <div className="space-y-5 text-sm">
//               <div>
//                 <label className="text-slate-400 text-xs font-semibold">
//                   Email address
//                 </label>
//                 <div className="mt-2 flex items-center gap-3 px-3.5 py-3 rounded-xl bg-slate-900/70 border border-slate-800">
//                   <Mail className="w-4 h-4 text-teal-400" />
//                   <span className="text-slate-100 break-all">
//                     {userData.email}
//                   </span>
//                 </div>
//               </div>

//               <div>
//                 <label className="text-slate-400 text-xs font-semibold">
//                   Phone number
//                 </label>
//                 <div className="mt-2 flex items-center gap-3 px-3.5 py-3 rounded-xl bg-slate-900/70 border border-slate-800">
//                   <Phone className="w-4 h-4 text-teal-400" />
//                   <span className="text-slate-100">{userData.phone}</span>
//                 </div>
//               </div>

//               <div>
//                 <label className="text-slate-400 text-xs font-semibold">
//                   Account type
//                 </label>
//                 <div className="mt-2 flex items-center gap-3 px-3.5 py-3 rounded-xl bg-teal-500/10 border border-teal-500/30">
//                   <Scissors className="w-4 h-4 text-teal-300" />
//                   <span className="text-teal-200 capitalize font-medium">
//                     {userData.role}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Account statistics (wallet & loyalty removed) */}
//           <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-7 shadow-[0_16px_40px_rgba(15,23,42,0.75)]">
//             <h3 className="text-xl sm:text-2xl font-semibold mb-5">
//               Account overview
//             </h3>

//             <div className="space-y-5 text-sm">
//               <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-slate-900/60">
//                 <span className="text-slate-400">Member since</span>
//                 <span className="text-slate-100 font-medium">
//                   {userData.joinDate}
//                 </span>
//               </div>

//               <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-slate-900/60">
//                 <span className="text-slate-400">Total bookings</span>
//                 <span className="text-teal-300 font-semibold">
//                   {userData.bookings}
//                 </span>
//               </div>

//               <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-slate-900/60">
//                 <span className="text-slate-400">Reviews given</span>
//                 <span className="text-yellow-300 font-semibold">
//                   {userData.reviews}
//                 </span>
//               </div>

//               <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/30">
//                 <span className="text-slate-300">Your rating</span>
//                 <div className="flex items-center gap-1">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`w-4 h-4 ${
//                         i < 4 ? "text-orange-400 fill-orange-400" : "text-slate-600"
//                       }`}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Link href="/my-booking">
//             <Button className="w-full bg-teal-500 hover:bg-teal-600 text-black font-semibold py-3 rounded-xl transition-transform hover:scale-[1.03]">
//               View bookings
//             </Button>
//           </Link>
//           <Link href="/payment">
//             <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-transform hover:scale-[1.03]">
//               Manage payments
//             </Button>
//           </Link>
//           <Button
//             onClick={handleLogout}
//             className="w-full bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/50 font-semibold py-3 rounded-xl transition-transform hover:scale-[1.03]"
//           >
//             Sign out
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
