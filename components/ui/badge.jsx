"use client";

import React from "react";
import clsx from "clsx";

export function Badge({ children, variant = "default", className, ...props }) {
  const baseStyles = "inline-flex items-center px-2 py-1 rounded-full text-sm font-medium";
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-green-100 text-green-800",
    destructive: "bg-red-100 text-red-800",
  };

  return (
    <span className={clsx(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
