import { Modal, Group, Button, Text, Title } from '@mantine/core';
import {
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';
import { ReactNode } from 'react';
import { ICustomModalProps, ModalType } from './types';

const defaultConfigs: Record<
  ModalType,
  {
    title: string;
    message: string;
    icon: ReactNode;
    confirmLabel: string;
    cancelLabel: string;
  }
> = {
  confirmation: {
    title: 'Are you sure?',
    message: 'This change will be applied immediately. Click confirm to continue.',
    icon: <IconAlertTriangle size={30} color="red" />,
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
  },
  info: {
    title: 'Information',
    message: '',
    icon: <IconInfoCircle size={30} color="blue" />,
    confirmLabel: 'OK',
    cancelLabel: 'Cancel',
  },
  success: {
    title: 'Success',
    message: '',
    icon: <IconCheck size={30} color="green" />,
    confirmLabel: 'Done',
    cancelLabel: 'Cancel',
  },
  error: {
    title: 'Error',
    message: '',
    icon: <IconX size={30} color="red" />,
    confirmLabel: 'Retry',
    cancelLabel: 'Cancel',
  },
};

export const CustomModal = ({
  opened,
  onClose,
  onConfirm,
  type = 'confirmation',
  title,
  message,
  confirmLabel,
  cancelLabel,
  icon,
  showCancel = true,
}: ICustomModalProps) => {
  const config = defaultConfigs[type];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title={
        <Group gap="xs" align="center">
          {icon ?? config.icon}
          <Title order={3}>{title ?? config.title}</Title>
        </Group>
      }
      overlayProps={{
        style: { background: 'rgba(0, 0, 0 , 0.1)' },
        blur: 1,
      }}
    >
      {message ?? config.message ? (
        <Text mb="md">{message ?? config.message}</Text>
      ) : null}

      <Group justify="flex-end">
        {showCancel && (
          <Button variant="default" onClick={onClose}>
            {cancelLabel ?? config.cancelLabel}
          </Button>
        )}
        {onConfirm && (
          <Button color="red" onClick={onConfirm}>
            {confirmLabel ?? config.confirmLabel}
          </Button>
        )}
      </Group>
    </Modal>
  );
};
