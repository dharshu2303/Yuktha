"use client";

import { forwardRef } from "react";

const Card = forwardRef(function Card({ children, className = "", hover = false, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={`bg-white border border-border rounded-card shadow-card ${
        hover ? "hover:shadow-card-hover transition-shadow duration-200" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

export default Card;
