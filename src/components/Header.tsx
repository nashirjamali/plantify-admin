"use client";

import { useAuth } from "../contexts/AuthContext";
import { Button, Icon } from "./ui";

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export default function Header({ onMenuClick, title }: HeaderProps) {
  const { signOut, principal } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-black hover:bg-gray-100 transition-colors duration-200"
          >
            <Icon name="menu" size="md" />
          </button>
          <h1 className="text-xl font-semibold text-black">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:block text-sm text-black">
            <span className="font-medium">Principal:</span> {principal?.toString().slice(0, 12)}...
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Icon name="logout" size="sm" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
