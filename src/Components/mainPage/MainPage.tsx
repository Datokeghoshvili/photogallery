import React, { useEffect, useState } from 'react';
import useInfiniteScroll from '../hooks/useInfinity';
import axios from 'axios';
import useDebounce from '../hooks/useDebounce';
import { useRecoilState } from 'recoil';
import { searchHistoryState } from '../../recoilState';
import './mainPage.css';

const API_URL: string = "https://api.unsplash.com/search/photos";
const API_KEY: string = "Ui9hjn0niqq5EsmFspxFvaLllw8MLZqxcRHTAdyDwfc";

type ImageType = {
  url: string;
  title: string;
  likes: number;
  download: number;
};

const MainPage: React.FC = () => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>("");
  const [cachedSearches, setCachedSearches] = useState<{ [key: string]: ImageType[] }>({});
  const [searchHistory, setSearchHistory] = useRecoilState(searchHistoryState);

  const debouncedValue = useDebounce(inputValue, 600);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    handleSearch(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    if (!inputValue) {
      fetchImages();
    }
  }, [inputValue]);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API_URL}?page=1&per_page=20&query=popular&order_by=popular&client_id=${API_KEY}`);
      const imagesData = response.data.results.map((result: any) => ({
        url: result.urls.regular,
        title: result.alt_description,
        likes: result.likes,
        downloads: result.downloads,
      }));
      setImages(imagesData);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);
  };

  const handleSearch = async (value: string) => {
    try {
      if (value === '') {
        fetchImages();
        return;
      }

      if (cachedSearches[value]) {
        setImages(cachedSearches[value]);
      } else {
        const response = await axios.get("https://api.unsplash.com/search/photos", {
          params: {
            query: value,
            client_id: API_KEY,
            per_page: 20,
          }
        });
        const imagesData = response.data.results.map((result: any) => ({
          url: result.urls.regular,
          title: result.alt_description,
        }));
        setImages(imagesData);
        setCachedSearches({ ...cachedSearches, [value]: imagesData });
      }

      if (!searchHistory.includes(value)) {
        setSearchHistory([...searchHistory, value]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchMoreImages = async () => {
    try {
      const nextPage = page + 1;
      const response = await axios.get(`${API_URL}?page=${nextPage}&per_page=20&query=car&order_by=popular&client_id=${API_KEY}`);
      const moreImages = response.data.results.map((result: any) => ({
        url: result.urls.regular,
        title: result.alt_description,
        likes: result.likes,
        downloads: result.downloads,
      }));
      setImages(prevImages => [...prevImages, ...moreImages]);
      setPage(nextPage);
    } catch (error) {
      console.error('Error fetching more images:', error);
    }
  };

  const isFetching = useInfiniteScroll(fetchMoreImages);

  return (
    <div>
      <h1 className="header">MainPage</h1>
      <input
        className='input'
        type="text"
        placeholder='Input text for search'
        value={inputValue}
        onChange={inputHandler}
      />

    

      {loading ? (
        <p>Loading....</p>
      ) : (
        <div className="image-list">
          {images.map((image, index) => (
            <div key={index} className="image-item">
              <img src={image.url} alt={`Image ${index + 1}`} />
              <p>{image.title}</p>
            </div>
          ))}
          {isFetching && <p>Loading more...</p>}
        </div>
      )}
    </div>
  );
};

export default MainPage;
