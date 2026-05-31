'use client';

import { useAuth } from '@/hooks/use-auth';
import { Bell, User, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  const { coordinator } = useAuth();
  const userLabel = coordinator?.role === 'COORDINATOR' ? 'Coordenador' : coordinator?.area;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-600 text-sm mt-1">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          {coordinator && (
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {coordinator.name}
                </p>
                {userLabel && (
                  <p className="text-xs text-gray-600">{userLabel}</p>
                )}
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
