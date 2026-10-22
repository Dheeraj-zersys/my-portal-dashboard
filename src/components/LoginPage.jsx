import React from "react";
import LoginForm from "../features/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-end pr-16 bg-gray-900">
      {/* Background Image Container */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage: 'url("/assets/gas%20station.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Login Card */}
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
