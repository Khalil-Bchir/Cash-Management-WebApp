'use client';

import { Star } from 'lucide-react';
import React, { useState } from 'react';

export function Navbar() {
  const [isActive, setIsActive] = useState(false); // State for mobile menu

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className="border">
      <div className="mx-auto max-w-7xl ">
        <div className="relative flex h-16 items-center justify-between">
          {/* Left section */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-2">
              <Star /> {/* Replace Star with your actual icon component */}
              <span className="text-xl font-bold uppercase text-gray-800">Superstar</span>
            </div>
          </div>

          {/* Right section */}
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              <a
                href="/cashier"
                className="hover:bg-secondary rounded-md px-3 py-2 text-sm font-medium"
              >
                Cashier
              </a>
              <a
                href="/archive"
                className="hover:bg-secondary rounded-md px-3 py-2 text-sm font-medium"
              >
                Archive
              </a>
              <a
                href="/history"
                className="hover:bg-secondary rounded-md px-3 py-2 text-sm font-medium"
              >
                History
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
