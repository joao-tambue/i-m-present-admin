'use client';

import { useEffect, useState } from 'react';
import { X, Loader } from 'lucide-react';
import { qrcodeService, getQRCodeError } from '@/services/qrcode-service';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

type ViewQRCodeModalProps = {
  employeeId: string;
  employeeName: string;
  isOpen: boolean;
  onClose: () => void;
};

export function ViewQRCodeModal({
  employeeId,
  employeeName,
  isOpen,
  onClose,
}: ViewQRCodeModalProps) {
  const [qrCode, setQRCode] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchQRCode = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await qrcodeService.getEmployeeQRCode(employeeId);
        setQRCode(data);
      } catch (err) {
        setError(getQRCodeError(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchQRCode();
  }, [isOpen, employeeId]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-sm max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{employeeName}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-6 h-6 text-purple-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          ) : qrCode ? (
            <div className="space-y-4">
              {/* QR Code Image */}
              <div className="flex justify-center">
                <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  {qrCode.imageDataUrl ? (
                    <img
                      src={qrCode.imageDataUrl}
                      alt={`QR Code de ${employeeName}`}
                      className="w-64 h-64 object-contain"
                    />
                  ) : (
                    <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded">
                      <span className="text-gray-500">QR Code indisponível</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase">
                    Código
                  </label>
                  <p className="text-sm font-mono text-gray-900 break-all mt-1">
                    {qrCode.token}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase">
                      Estado
                    </label>
                    <p className="text-sm mt-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          qrCode.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {qrCode.status === 'ACTIVE' ? 'Ativo' : 'Revogado'}
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase">
                      Emitido em
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {format(new Date(qrCode.issuedAt), 'dd MMM yyyy', {
                        locale: pt,
                      })}
                    </p>
                  </div>
                </div>

                {qrCode.revokedAt && (
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase">
                      Revogado em
                    </label>
                    <p className="text-sm text-red-900 mt-1">
                      {format(new Date(qrCode.revokedAt), 'dd MMM yyyy HH:mm', {
                        locale: pt,
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </>
  );
}
