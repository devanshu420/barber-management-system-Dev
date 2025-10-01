"use client";

import React from "react";

export function Textarea({ id, placeholder, value, onChange, className = "", ...props }) {
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
      {...props}
    />
  );
}
