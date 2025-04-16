export type ModalType = 'confirmation' | 'info' | 'success' | 'error';

export interface ICustomModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  type?: ModalType;

  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: React.ReactNode;

  showCancel?: boolean;
};