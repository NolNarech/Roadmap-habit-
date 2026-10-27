import { Modal } from './Modal';
import { Button } from './Button';

/**
 * Generic "are you sure?" dialog for destructive actions (delete task,
 * delete project, delete note, etc). Centralizing this in one place means
 * every delete button in the app gets the same confirm step instead of
 * firing instantly on a single click / accidental tap.
 */
export function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="text-sm text-surface-300">{message}</p>
    </Modal>
  );
}
