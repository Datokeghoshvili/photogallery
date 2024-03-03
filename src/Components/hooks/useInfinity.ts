import { useState, useEffect } from 'react';

type Callback = () => void;

const useInfiniteScroll = (callback: Callback) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        isFetching
      )
        return;
      setIsFetching(true);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching]);

  useEffect(() => {
    if (!isFetching) 
    return;
    callback();
    setIsFetching(false);
  }, [isFetching, callback]);

  return isFetching;
};

export default useInfiniteScroll;
