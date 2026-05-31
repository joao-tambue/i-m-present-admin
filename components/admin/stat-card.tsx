import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'stable';
  backgroundColor?: string;
  textColor?: string;
  iconBgColor?: string;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  backgroundColor = 'bg-white',
  textColor = 'text-purple-600',
  iconBgColor = 'bg-purple-100',
}: StatCardProps) {
  return (
    <div
      className={`${backgroundColor} rounded-xl shadow-sm border border-gray-200 p-6 flex items-start gap-4`}
    >
      {icon && (
        <div className={`${iconBgColor} rounded-lg p-3 flex items-center justify-center`}>
          <div className={textColor}>{icon}</div>
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <p className={`text-2xl font-bold ${textColor} mt-1`}>{value}</p>
        {trend && (
          <p className="text-xs mt-2">
            {trend === 'up' && <span className="text-green-600">↑ Em alta</span>}
            {trend === 'down' && <span className="text-red-600">↓ Em baixa</span>}
            {trend === 'stable' && <span className="text-gray-500">→ Estável</span>}
          </p>
        )}
      </div>
    </div>
  );
}
