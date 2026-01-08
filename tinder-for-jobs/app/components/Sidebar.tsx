"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Home, User, TrendingUp, Briefcase } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || "/";

  const navItems = [
    { id: "swipe", href: "/", label: "Swipe", icon: Home },
    { id: "profile", href: "/profile", label: "Profile", icon: User },
    { id: "grow", href: "/grow", label: "Grow", icon: TrendingUp },
    { id: "applications", href: "/applications", label: "Applications", icon: Briefcase },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="md:hidden fixed top-4 left-4 z-100 w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-md"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </motion.button>

      {/* Mobile overlay + drawer */}
      {isOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/40 z-80" onClick={() => setIsOpen(false)} />

          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed left-0 top-0 bottom-0 w-72 bg-white shadow-xl p-4 z-100 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-black text-indigo-600">SWIPEHIRE</div>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-md hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg font-semibold text-sm transition-colors ${
                      active ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t">
              <p className="text-xs text-slate-500 text-center">SwipeHire © {new Date().getFullYear()}</p>
            </div>
          </motion.aside>
        </>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:left-0 bg-white border-r">
        <div className="h-16 flex items-center px-6 border-b">
          <div className="text-lg font-black text-indigo-600">SWIPEHIRE</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((n) => {
            const Icon = n.icon;
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  active ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon size={16} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t text-sm text-slate-500">© SwipeHire</div>
      </aside>
    </>
  );
}