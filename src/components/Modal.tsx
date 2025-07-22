import './Modal.css'
import ReactDOM from 'react-dom';
import type { ModalProps } from '../types/types';

export default function Modal({ children, onClose, isVisible }: ModalProps) {
  return ReactDOM.createPortal(
    <div style={{ visibility: isVisible ? 'visible' : 'hidden' }} className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}
