import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.scss';

const modalRoot = document.querySelector('#modal') as HTMLElement;

interface ModalProps {
  children: React.ReactNode[];
  onClose: () => void;
}

export const Modal = ({ children, onClose }: ModalProps) => {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === 'Escape') {
        onClose();
      }
    }

    document.body.style.overflowY = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflowY = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.nodeName === 'DIV' && target?.className.includes('backdrop')) {
      onClose();
    }
  };

  return createPortal(
    <div className="backdrop" onMouseDown={handleBackdropClick}>
      <div className={css['modal-content']}>
        <button type="button" className={css['close-button']} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>,
    modalRoot,
  );
};
