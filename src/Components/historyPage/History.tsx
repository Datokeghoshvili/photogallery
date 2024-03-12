import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import Modal from 'react-modal';
import { searchHistoryState } from '../../recoilState';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import './history.css';

const API_URL = "https://api.unsplash.com/search/photos";
const API_KEY = "Ui9hjn0niqq5EsmFspxFvaLllw8MLZqxcRHTAdyDwfc";

type ImageType = {
  url: string;
  title: string;
  likes: number;
  downloads: number;
  views: number;
};

const History: React.FC = () => {
  const searchHistory = useRecoilValue(searchHistoryState);
  const [clickedImage, setClickedImage] = useState<string>(''); // Corrected initial state to be a string
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [images, setImages] = useState<ImageType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Adjusted to use the correct string type for searchTerm
  const fetchImages = async (searchTerm: string) => {
    if (!searchTerm) 
      return; // Do nothing if searchTerm is empty
    
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        params: {
          query: searchTerm,
          client_id: API_KEY,
          page: page,
          per_page: 10,
        },
      });
      const newImages = response.data.results.map((result: any) => ({
        url: result.urls.regular,
        title: result.alt_description || 'Untitled', // Fallback title
        likes: result.likes,
        downloads: result.downloads,
        views: result.views,
      }));
      setImages(prevImages => [...prevImages, ...newImages]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Resets
    setPage(1);
    setImages([]);
    if (clickedImage) {
      fetchImages(clickedImage);
    }
  }, [clickedImage]);

  const handleImageClick = (image: ImageType) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  // Using useInfiniteScroll for more fetching based on scroll, adjust as needed
 
  useInfiniteScroll(() => fetchImages(clickedImage));

  return (
    <div className="history-container">
      <h1 className="history-title">Searched Names History</h1>
      <ul className='history-list'>
        {searchHistory.map((item, index) => (
          <li
            className='history-item'
            key={index}
            onClick={() => setClickedImage(item)}
          > 
            {item}
          </li>
        ))}
      </ul>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="image-modal"
        overlayClassName="image-modal-overlay"
      >
        <button onClick={closeModal} className="close-button">Close</button>
        {selectedImage && (
          <>
            <img src={selectedImage.url} alt={selectedImage.title || 'Untitled Image'} className="modal-image" />
            <div className="image-info">
              <p>Views: {selectedImage.views}</p>
              <p>Likes: {selectedImage.likes}</p>
              <p>Downloads: {selectedImage.downloads}</p>
            </div>
          </>
        )}
      </Modal>
      {loading && <p>Loading...</p>}
      <div className="image-list">
        {images.map((image, index) => (
          <div key={index} className="image-item" onClick={() => handleImageClick(image)}>
            <img src={image.url} alt={image.title || 'Untitled Image'} />
            <p>{image.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
