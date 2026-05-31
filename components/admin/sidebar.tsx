'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Clock, BarChart3, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      name: 'Funcionários',
      href: '/admin/employees',
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: 'Presenças',
      href: '/admin/attendance',
      icon: <Clock className="w-5 h-5" />,
    },
    {
      name: 'Relatórios',
      href: '/admin/reports',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      name: 'Configurações',
      href: '/admin/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-purple-700">
        <h1 className="text-2xl font-bold">SmartFlow</h1>
        <p className="text-purple-300 text-sm mt-1">Gerenciamento de Presença</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive(item.href)
                ? 'bg-purple-700 text-white'
                : 'text-purple-200 hover:bg-purple-700/50'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-purple-700">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-purple-200 hover:bg-purple-700/50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
