'use client';

// Import useAppDispatch
import { logout } from '@/services/authSlice';
import { useAppDispatch } from '@/services/hooks';
import { Star } from 'lucide-react';
import { LogOut } from 'lucide-react';
// Import logout action
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// Import useRouter for redirection

export function Navbar() {
  const [isActive, setIsActive] = useState(false); // State for mobile menu
  const dispatch = useAppDispatch();
  const router = useRouter();

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Adjusted padding */}
        <div className="relative flex h-16 items-center justify-between">
          {/* Left section */}
          <div className="flex items-center">
            <div className="flex flex-shrink-0 items-center space-x-2">
              <Star /> {/* Replace Star with your actual icon component */}
              <span className="text-xl font-bold uppercase">Superstar</span>
            </div>
          </div>

          {/* Right section */}
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              <a href="/" className="hover:bg-secondary rounded-md px-3 py-2 text-sm font-medium">
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

              <button
                onClick={handleLogout}
                className="hover:bg-secondary rounded-md px-3 py-2 text-sm font-medium"
              >
                <LogOut />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
