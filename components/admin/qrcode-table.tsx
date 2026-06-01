'use client';

import { useState } from 'react';
import { QRCodeWithEmployee } from '@/services/qrcode-service';
import { Trash2, RotateCcw, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { QRCodeActionDialog } from './qrcode-action-dialog';

type QRCodeTableProps = {
  qrCodes: QRCodeWithEmployee[];
  isLoading: boolean;
  onRegenerateClick: (employeeId: string) => void;
  onRevokeClick: (employeeId: string) => void;
  regeneratingId?: string | null;
  revokingId?: string | null;
};

export function QRCodeTable({
  qrCodes,
  isLoading,
  onRegenerateClick,
  onRevokeClick,
  regeneratingId,
  revokingId,
}: QRCodeTableProps) {
  const [actionDialog, setActionDialog] = useState<{
    type: 'regenerate' | 'revoke';
    employeeId: string;
    employeeName: string;
  } | null>(null);

  const handleActionConfirm = () => {
    if (!actionDialog) return;

    if (actionDialog.type === 'regenerate') {
      onRegenerateClick(actionDialog.employeeId);
    } else {
      onRevokeClick(actionDialog.employeeId);
    }

    setActionDialog(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-6 h-6 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (qrCodes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg font-medium">Nenhum QR Code encontrado</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Funcionário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Emitido em
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {qrCodes.map((qrCode) => (
              <tr
                key={qrCode.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {qrCode.employeeName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {qrCode.employeeEmail}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                  {qrCode.code.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      qrCode.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {qrCode.status === 'ACTIVE' ? 'Ativo' : 'Revogado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {format(new Date(qrCode.issuedAt), 'dd MMM yyyy HH:mm', {
                    locale: pt,
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setActionDialog({
                          type: 'regenerate',
                          employeeId: qrCode.employeeId,
                          employeeName: qrCode.employeeName,
                        })
                      }
                      disabled={
                        regeneratingId === qrCode.employeeId ||
                        revokingId === qrCode.employeeId
                      }
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Regenerar QR Code"
                    >
                      {regeneratingId === qrCode.employeeId ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <RotateCcw className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() =>
                        setActionDialog({
                          type: 'revoke',
                          employeeId: qrCode.employeeId,
                          employeeName: qrCode.employeeName,
                        })
                      }
                      disabled={
                        qrCode.status === 'REVOKED' ||
                        regeneratingId === qrCode.employeeId ||
                        revokingId === qrCode.employeeId
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Revogar QR Code"
                    >
                      {revokingId === qrCode.employeeId ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {actionDialog && (
        <QRCodeActionDialog
          type={actionDialog.type}
          employeeName={actionDialog.employeeName}
          onConfirm={handleActionConfirm}
          onCancel={() => setActionDialog(null)}
        />
      )}
    </>
  );
}
