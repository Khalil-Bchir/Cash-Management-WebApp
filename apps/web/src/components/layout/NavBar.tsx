'use client';

import { logout } from '@/services/authSlice';
import { useAppDispatch } from '@/services/hooks';
import { Star } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <nav className="border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex flex-shrink-0 items-center space-x-2">
              <Star />
              <span className="text-xl font-bold uppercase">Superstar</span>
            </div>
          </div>

          <div className="sm:hidden">
            <button onClick={toggleMenu} className="p-2">
              {isActive ? 'Fermer' : 'Menu'}
            </button>
          </div>

          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              <a href="/" className="hover:bg-secondary rounded-md px-3 py-2 text-sm font-medium">
                Caissier
              </a>
              <a
                href="/archive"
                className="hover:bg-secondary rounded-md px-3 py-2 text-sm font-medium"
              >
                Archives
              </a>
              <a
                href="/history"
                className="hover:bg-secondary rounded-md px-3 py-2 text-sm font-medium"
              >
                Historique
              </a>

              <a
                href="/products"
                className="hover:bg-secondary rounded-md px-3 py-2 text-sm font-medium"
              >
                Produits
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

        {isActive && (
          <div className="sm:hidden">
            <div className="mt-2 flex flex-col space-y-2">
              <a
                href="/"
                className="hover:bg-secondary block rounded-md px-3 py-2 text-sm font-medium"
              >
                Caissier
              </a>
              <a
                href="/archive"
                className="hover:bg-secondary block rounded-md px-3 py-2 text-sm font-medium"
              >
                Archives
              </a>
              <a
                href="/history"
                className="hover:bg-secondary block rounded-md px-3 py-2 text-sm font-medium"
              >
                Historique
              </a>

              <a
                href="/products"
                className="hover:bg-secondary block rounded-md px-3 py-2 text-sm font-medium"
              >
                Produits
              </a>

              <button
                onClick={handleLogout}
                className="hover:bg-secondary block rounded-md px-3 py-2 text-sm font-medium"
              >
                <LogOut />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
