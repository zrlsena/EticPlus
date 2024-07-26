import React from 'react';
import './Modal.css'; 

const Modal = ({ message, onClose }) => {
  if (!message) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose} className="modal-button">Tamam</button>
      </div>
    </div>
  );
};

export default Modal;
