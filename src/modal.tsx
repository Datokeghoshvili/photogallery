import React from 'react';
import './modal.css';

type ModalProps = {
  imageUrl: string;
  title: string;
  likes: number;
  views: number;
  closeModal: () => void;
};

const Modal: React.FC<ModalProps> = ({ imageUrl, title, likes, views, closeModal }) => {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt={title} />
        <div className="image-details">
          <h3>{title}</h3>
          <p>Likes: {likes}</p>
          <p>Views: {views}</p>
          <button onClick={closeModal}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
