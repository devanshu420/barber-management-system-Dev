// // src/components/ui/card.jsx

// "use client";

// import React from "react";
// import clsx from "clsx";

// // Main Card container
// export function Card({ children, className, ...props }) {
//   return (
//     <div
//       className={clsx(
//         "rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden",
//         className
//       )}
//       {...props}
//     >
//       {children}
//     </div>
//   );
// }

// // Card Header
// export function CardHeader({ children, className, ...props }) {
//   return (
//     <div
//       className={clsx("p-4 border-b border-gray-200", className)}
//       {...props}
//     >
//       {children}
//     </div>
//   );
// }

// // Card Title (usually inside CardHeader)
// export function CardTitle({ children, className, ...props }) {
//   return (
//     <h3
//       className={clsx("text-lg font-semibold text-gray-900", className)}
//       {...props}
//     >
//       {children}
//     </h3>
//   );
// }

// // Card Content
// export function CardContent({ children, className, ...props }) {
//   return (
//     <div className={clsx("p-4", className)} {...props}>
//       {children}
//     </div>
//   );
// }

// export default Card;

// components/ui/card.jsx
"use client";
import React from "react";

export function Card({ children, className }) {
  return <div className={`rounded-lg border p-4 bg-white ${className}`}>{children}</div>;
}

export function CardHeader({ children, className }) {
  return <div className={`mb-2 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className }) {
  return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
}

export function CardContent({ children, className }) {
  return <div className={`${className}`}>{children}</div>;
}
