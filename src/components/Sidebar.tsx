"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Icon } from "./ui";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { principal } = useAuth();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "loading",
    },
    {
      name: "Testing Data",
      href: "/testing-data",
      icon: "loading",
    },
    {
      name: "Investor Testing",
      href: "/investor-testing",
      icon: "check",
    },
    {
      name: "Review Startups",
      href: "/review-startups",
      icon: "check",
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0 lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Icon name="loading" size="sm" className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-black">Plantify Admin</h1>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-black hover:bg-gray-100"
            >
              <Icon name="x" size="md" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.href);
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-black text-white"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <div className="flex-shrink-0">
                  <Icon name={item.icon as any} size="sm" />
                </div>
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Icon name="loading" size="sm" className="text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black truncate">Admin User</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-black truncate">
                    {principal?.toString().slice(0, 8)}...
                  </p>
                  <button
                    onClick={() => {
                      if (principal) {
                        navigator.clipboard.writeText(principal.toString());
                        // You could add a toast notification here
                        alert('Principal ID copied to clipboard!');
                      }
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                    title="Copy full Principal ID"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}