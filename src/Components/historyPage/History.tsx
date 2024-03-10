// History.tsx

import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import Modal from 'react-modal';
import { searchHistoryState } from '../../recoilState';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import './history.css';

const API_URL: string = "https://api.unsplash.com/search/photos";
const API_KEY: string = "Ui9hjn0niqq5EsmFspxFvaLllw8MLZqxcRHTAdyDwfc";

type ImageType = {
  url: string;
  title: string;
  likes: number;
  downloads: number;
  views: number;
};

const History: React.FC = () => {
  const searchHistory = useRecoilValue(searchHistoryState);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [images, setImages] = useState<ImageType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchImages = async (searchTerm: string) => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        params: {
          query: searchTerm,
          client_id: API_KEY,
          page: page,
          per_page: 10, // Number of images per page
        }
      });

      const newImages = response.data.results.map((result: any) => ({
        url: result.urls.regular,
        title: result.alt_description,
        likes: result.likes,
        downloads: result.downloads,
        views: result.views,
      }));

      setImages((prevImages) => [...prevImages, ...newImages]);
      setPage(page + 1);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchHistory.length > 0) {
      fetchImages(searchHistory[searchHistory.length - 1]);
    }
  }, [searchHistory]);

  const handleImageClick = async (image: ImageType) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  const isFetching = useInfiniteScroll(() => fetchImages(searchHistory[searchHistory.length - 1]));

  return (
    <div className="history-container">
      <h1 className="history-title">Searched Names History</h1>
      <ul className='history-list'>
        {searchHistory.map((item, index) => (
          <li
            className='history-item'
            key={index}
            onClick={() => fetchImages(item)}
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
            <img src={selectedImage.url} alt={selectedImage.title} className="modal-image" />
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
            <img src={image.url} alt={image.title} />
            <p>{image.title}</p>
          </div>
        ))}
        {isFetching && <p>Loading more...</p>}
      </div>
    </div>
  );
};

export default History;
