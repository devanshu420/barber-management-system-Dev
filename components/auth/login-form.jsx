"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Scissors } from "lucide-react";

export function LoginForm({ role = "customer" }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState(role); // ✅ State for role selection
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      }, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Backend response:", response.data);

      if (response.data.success) {
        const userFromDB = response.data.user;
        
        // Get actual role from database
        const actualRole = userFromDB.role || userFromDB.userType || "customer";

        console.log("User role from DB:", actualRole);
        console.log("Selected role in form:", selectedRole);

        // ✅ Check if roles match
        if (actualRole !== selectedRole) {
          setMessage(
            `❌ Role mismatch! You are registered as "${actualRole}" but trying to login as "${selectedRole}". Please select the correct role.`
          );
          setLoading(false);
          return;
        }

        // ✅ Roles match - proceed with login
        setMessage("✅ Login successful!");

        // Store in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", userFromDB.name);
        localStorage.setItem("userEmail", userFromDB.email);
        localStorage.setItem("userRole", actualRole);
        localStorage.setItem("userId", userFromDB._id || userFromDB.id);

        console.log("Login successful. Role:", actualRole);

        // Role-based routing
        setTimeout(() => {
          if (actualRole === "barber") {
            router.push("/barber-shop");
          } else if (actualRole === "admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/");
          }
        }, 1500);
      } else {
        setMessage(`❌ ${response.data.message || "Invalid credentials"}`);
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        if (error.response.status === 404) {
          setMessage("❌ User does not exist.");
        } else if (error.response.status === 401) {
          setMessage("❌ Incorrect password.");
        } else {
          setMessage(`❌ ${error.response.data.message || "Login failed."}`);
        }
      } else {
        setMessage("❌ Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-2xl p-8 space-y-6 w-full max-w-md hover:border-gray-700/50 transition animate-fadeIn"
    >
      {/* Form Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-500/20 rounded-full mb-3">
          <Scissors className="w-6 h-6 text-teal-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
        <p className="text-gray-400 text-sm">Login to your account</p>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex gap-3 bg-gray-800/50 p-2 rounded-lg border border-gray-700">
        <button
          type="button"
          onClick={() => setSelectedRole("customer")}
          className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition ${
            selectedRole === "customer"
              ? "bg-teal-500 text-black"
              : "bg-transparent text-gray-400 hover:text-white"
          }`}
        >
          Customer
        </button>
        <button
          type="button"
          onClick={() => setSelectedRole("barber")}
          className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition ${
            selectedRole === "barber"
              ? "bg-teal-500 text-black"
              : "bg-transparent text-gray-400 hover:text-white"
          }`}
        >
          Barber
        </button>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-300 text-sm font-semibold block">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-600 text-sm py-2.5 w-full focus:border-teal-500/50 focus:bg-gray-800/80 transition"
          required
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-300 text-sm font-semibold block">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-600 text-sm py-2.5 pr-10 w-full focus:border-teal-500/50 focus:bg-gray-800/80 transition"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-teal-400 transition"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-teal-500 via-teal-500 to-teal-600 hover:from-teal-600 hover:via-teal-600 hover:to-teal-700 text-black font-semibold rounded-lg transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg hover:shadow-xl"
      >
        {loading ? "Signing In..." : "Sign In"}
      </Button>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`p-4 rounded-lg text-center text-sm font-medium transition ${
            message.startsWith("✅")
              ? "bg-green-500/20 text-green-400 border border-green-500/50"
              : "bg-red-500/20 text-red-400 border border-red-500/50"
          }`}
        >
          {message}
        </div>
      )}

      {/* Sign Up Link */}
      <div className="pt-4 border-t border-gray-800 text-center">
        <p className="text-gray-400 text-sm">
          Don't have an account?{" "}
          <a
            href="/auth/register"
            className="text-teal-400 font-semibold hover:text-teal-300 transition"
          >
            Sign Up
          </a>
        </p>
      </div>

      {/* Current Role Display */}
      <div className="pt-2 text-center">
        <p className="text-gray-500 text-xs">
          Logging in as: <span className="text-teal-400 font-semibold capitalize">{selectedRole}</span>
        </p>
      </div>
    </form>
  );
}


// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Eye, EyeOff, Scissors } from "lucide-react";

// export function LoginForm({ role = "customer" }) {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     role: role, // Use prop value
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       setLoading(true);

//       const response = await axios.post("http://localhost:5000/api/auth/login", formData, {
//         headers: { "Content-Type": "application/json" },
//       });

//       if (response.data.success) {
//         setMessage("✅ Login successful!");
        
//         // 🔹 Store in localStorage
//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("userName", response.data.user.name);
//         localStorage.setItem("userEmail", response.data.user.email);
//         localStorage.setItem("userRole", response.data.user.role || formData.role);
//         localStorage.setItem("userId", response.data.user._id || response.data.user.id);

//         // 🔹 Role-based routing
//         setTimeout(() => {
//           const userRole = response.data.user.role || formData.role;

//           if (userRole === "barber") {
//             // Check if barber has registered shop
//             router.push("/barber-shop");
//           } else if (userRole === "admin") {
//             router.push("/admin/dashboard");
//           } else {
//             // Default to customer dashboard
//             router.push("/");
//           }
//         }, 1500);
//       } else {
//         setMessage(`❌ ${response.data.message || "User does not exist or invalid credentials"}`);
//       }
//     } catch (error) {
//       console.error("Login error:", error);

//       if (error.response) {
//         if (error.response.status === 404) {
//           setMessage("❌ User does not exist.");
//         } else if (error.response.status === 401) {
//           setMessage("❌ Incorrect password.");
//         } else {
//           setMessage(`❌ ${error.response.data.message || "Login failed."}`);
//         }
//       } else {
//         setMessage("❌ Unable to connect to the server. Please check backend.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-2xl p-8 space-y-6 w-full max-w-md hover:border-gray-700/50 transition animate-fadeIn"
//     >
//       {/* 🔹 Form Header */}
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-500/20 rounded-full mb-3">
//           <Scissors className="w-6 h-6 text-teal-400" />
//         </div>
//         <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
//         <p className="text-gray-400 text-sm">
//           {formData.role === "barber" ? "Barber Login" : "Customer Login"}
//         </p>
//       </div>

//       {/* 🔹 Email */}
//       <div className="space-y-2">
//         <Label htmlFor="email" className="text-gray-300 text-sm font-semibold block">
//           Email Address
//         </Label>
//         <Input
//           id="email"
//           type="email"
//           placeholder="john@example.com"
//           value={formData.email}
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-600 text-sm py-2.5 w-full focus:border-teal-500/50 focus:bg-gray-800/80 transition"
//           required
//         />
//       </div>

//       {/* 🔹 Password */}
//       <div className="space-y-2">
//         <Label htmlFor="password" className="text-gray-300 text-sm font-semibold block">
//           Password
//         </Label>
//         <div className="relative">
//           <Input
//             id="password"
//             type={showPassword ? "text" : "password"}
//             placeholder="Enter your password"
//             value={formData.password}
//             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//             className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-600 text-sm py-2.5 pr-10 w-full focus:border-teal-500/50 focus:bg-gray-800/80 transition"
//             required
//           />
//           <Button
//             type="button"
//             variant="ghost"
//             size="sm"
//             className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-teal-400 transition"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? (
//               <EyeOff className="w-4 h-4" />
//             ) : (
//               <Eye className="w-4 h-4" />
//             )}
//           </Button>
//         </div>
//       </div>

//       {/* 🔹 Submit Button */}
//       <Button
//         type="submit"
//         disabled={loading}
//         className="w-full py-3 bg-gradient-to-r from-teal-500 via-teal-500 to-teal-600 hover:from-teal-600 hover:via-teal-600 hover:to-teal-700 text-black font-semibold rounded-lg transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg hover:shadow-xl"
//       >
//         {loading ? "Signing In..." : "Sign In"}
//       </Button>

//       {/* 🔹 Success/Error Message */}
//       {message && (
//         <div
//           className={`p-4 rounded-lg text-center text-sm font-medium transition ${
//             message.startsWith("✅")
//               ? "bg-green-500/20 text-green-400 border border-green-500/50"
//               : "bg-red-500/20 text-red-400 border border-red-500/50"
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       {/* 🔹 Sign Up Link */}
//       <div className="pt-4 border-t border-gray-800 text-center">
//         <p className="text-gray-400 text-sm">
//           Don't have an account?{" "}
//           <a
//             href="/auth/register"
//             className="text-teal-400 font-semibold hover:text-teal-300 transition"
//           >
//             Sign Up
//           </a>
//         </p>
//       </div>

//       {/* 🔹 Role Info */}
//       <div className="pt-2 text-center">
//         <p className="text-gray-500 text-xs">
//           Logging in as: <span className="text-teal-400 font-semibold capitalize">{formData.role}</span>
//         </p>
//       </div>
//     </form>
//   );
// }








// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Eye, EyeOff, Scissors } from "lucide-react";

// export function LoginForm({ role = "customer" }) {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     role: role, // Use prop value
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       setLoading(true);

//       const response = await axios.post("http://localhost:5000/api/auth/login", formData, {
//         headers: { "Content-Type": "application/json" },
//       });

//       if (response.data.success) {
//         setMessage("✅ Login successful!");
//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("userName", response.data.user.name);

//         setTimeout(() => {
//           router.push("/");
//         }, 1500);
//       } else {
//         setMessage(`❌ ${response.data.message || "User does not exist or invalid credentials"}`);
//       }
//     } catch (error) {
//       console.error("Login error:", error);

//       if (error.response) {
//         if (error.response.status === 404) {
//           setMessage("❌ User does not exist.");
//         } else if (error.response.status === 401) {
//           setMessage("❌ Incorrect password.");
//         } else {
//           setMessage(`❌ ${error.response.data.message || "Login failed."}`);
//         }
//       } else {
//         setMessage("❌ Unable to connect to the server. Please check backend.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-2xl p-8 space-y-6 w-full max-w-md hover:border-gray-700/50 transition animate-fadeIn"
//     >
//       {/* 🔹 Form Header */}
     

//       {/* 🔹 Email */}
//       <div className="space-y-2">
//         <Label htmlFor="email" className="text-gray-300 text-sm font-semibold block">
//           Email Address
//         </Label>
//         <Input
//           id="email"
//           type="email"
//           placeholder="john@example.com"
//           value={formData.email}
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-600 text-sm py-2.5 w-full focus:border-teal-500/50 focus:bg-gray-800/80 transition"
//           required
//         />
//       </div>

//       {/* 🔹 Password */}
//       <div className="space-y-2">
//         <Label htmlFor="password" className="text-gray-300 text-sm font-semibold block">
//           Password
//         </Label>
//         <div className="relative">
//           <Input
//             id="password"
//             type={showPassword ? "text" : "password"}
//             placeholder="Enter your password"
//             value={formData.password}
//             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//             className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-600 text-sm py-2.5 pr-10 w-full focus:border-teal-500/50 focus:bg-gray-800/80 transition"
//             required
//           />
//           <Button
//             type="button"
//             variant="ghost"
//             size="sm"
//             className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-teal-400 transition"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? (
//               <EyeOff className="w-4 h-4" />
//             ) : (
//               <Eye className="w-4 h-4" />
//             )}
//           </Button>
//         </div>
//       </div>

//       {/* 🔹 Submit Button */}
//       <Button
//         type="submit"
//         disabled={loading}
//         className="w-full py-3 bg-gradient-to-r from-teal-500 via-teal-500 to-teal-600 hover:from-teal-600 hover:via-teal-600 hover:to-teal-700 text-black font-semibold rounded-lg transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg hover:shadow-xl"
//       >
//         {loading ? "Signing In..." : "Sign In"}
//       </Button>

//       {/* 🔹 Success/Error Message */}
//       {message && (
//         <div
//           className={`p-4 rounded-lg text-center text-sm font-medium transition ${
//             message.startsWith("✅")
//               ? "bg-green-500/20 text-green-400 border border-green-500/50"
//               : "bg-red-500/20 text-red-400 border border-red-500/50"
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       {/* 🔹 Sign Up Link */}
//       <div className="pt-4 border-t border-gray-800 text-center">
//         <p className="text-gray-400 text-sm">
//           Don't have an account?{" "}
//           <a
//             href="/auth/register"
//             className="text-teal-400 font-semibold hover:text-teal-300 transition"
//           >
//             Sign Up
//           </a>
//         </p>
//       </div>
//     </form>
//   );
// }