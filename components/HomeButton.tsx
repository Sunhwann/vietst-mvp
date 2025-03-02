"use client";

import React from "react";
import Link from "next/link";

export default function HomeButton() {
  return (
    <div className="mb-4">
      <Link href="/" className="bg-gray-800 text-white px-4 py-2 rounded">
        🏠 홈으로
      </Link>
    </div>
  );
}
