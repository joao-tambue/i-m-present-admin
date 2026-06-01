'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type QRCodeActionDialogProps = {
  type: 'regenerate' | 'revoke';
  employeeName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function QRCodeActionDialog({
  type,
  employeeName,
  onConfirm,
  onCancel,
}: QRCodeActionDialogProps) {
  const isRevoke = type === 'revoke';

  return (
    <AlertDialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isRevoke ? 'Revogar QR Code?' : 'Regenerar QR Code?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isRevoke ? (
              <>
                Tem a certeza que deseja <strong>revogar</strong> o QR Code de{' '}
                <strong>{employeeName}</strong>? Isto impedirá que o funcionário
                faça check-in/check-out com este código.
              </>
            ) : (
              <>
                Tem a certeza que deseja <strong>regenerar</strong> o QR Code de{' '}
                <strong>{employeeName}</strong>? Um novo código será gerado e o
                anterior será inválido.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              isRevoke
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }
          >
            {isRevoke ? 'Revogar' : 'Regenerar'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
