'use client';

import { Header } from '@/components/admin/header';
import { useAuth } from '@/hooks/use-auth';
import { Bell, Lock, Users, Palette, Save } from 'lucide-react';
import { useState } from 'react';

const initialSettings = {
  notifications: true,
  emailAlerts: true,
  weeklyReport: true,
  darkMode: false,
};

type SettingsKey = keyof typeof initialSettings;

export default function SettingsPage() {
  const { coordinator } = useAuth();
  const userLabel = coordinator?.role === 'COORDINATOR' ? 'Coordenador' : coordinator?.area;
  const [settings, setSettings] = useState(initialSettings);

  const handleToggle = (key: SettingsKey) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    console.log('[v0] Settings saved:', settings);
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <Header
        title="Configurações"
        description="Gerencie as configurações do seu painel"
      />

      <main className="flex-1 p-8 space-y-8">
        {/* Profile Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Perfil</h2>
              <p className="text-gray-600 text-sm mt-1">
                Informações da sua conta
              </p>
            </div>
            <Users className="w-6 h-6 text-purple-600" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={coordinator?.name || ''}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={coordinator?.email || ''}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Perfil
              </label>
              <input
                type="text"
                value={userLabel || ''}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Notificações</h2>
              <p className="text-gray-600 text-sm mt-1">
                Configure como você deseja ser notificado
              </p>
            </div>
            <Bell className="w-6 h-6 text-blue-600" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">
                  Notificações em Tempo Real
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Receba alertas imediatos de eventos importantes
                </p>
              </div>
              <button
                onClick={() => handleToggle('notifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                ></span>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Alertas por Email</p>
                <p className="text-sm text-gray-600 mt-1">
                  Receba resumos por email diariamente
                </p>
              </div>
              <button
                onClick={() => handleToggle('emailAlerts')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailAlerts ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                ></span>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Relatório Semanal</p>
                <p className="text-sm text-gray-600 mt-1">
                  Envie um relatório detalhado todo domingo
                </p>
              </div>
              <button
                onClick={() => handleToggle('weeklyReport')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.weeklyReport ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.weeklyReport ? 'translate-x-6' : 'translate-x-1'
                  }`}
                ></span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Segurança</h2>
              <p className="text-gray-600 text-sm mt-1">
                Gerencie a segurança da sua conta
              </p>
            </div>
            <Lock className="w-6 h-6 text-red-600" />
          </div>

          <button className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-left">
            Alterar Senha
          </button>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              ⚠️ Última alteração de senha: 30 dias atrás
            </p>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Aparência</h2>
              <p className="text-gray-600 text-sm mt-1">
                Customize a aparência do painel
              </p>
            </div>
            <Palette className="w-6 h-6 text-purple-600" />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Modo Escuro</p>
              <p className="text-sm text-gray-600 mt-1">
                Ativa o modo escuro para conforto visual
              </p>
            </div>
            <button
              onClick={() => handleToggle('darkMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.darkMode ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              ></span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            Salvar Configurações
          </button>
        </div>
      </main>
    </div>
  );
}
