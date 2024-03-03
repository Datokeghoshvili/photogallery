import React from 'react';
import { BrowserRouter as Router, Route, Routes as ReactRoutes } from 'react-router-dom';
import MainPage from './Components/mainPage/MainPage';
import History from './Components/historyPage/History';

interface Props {
  searchHistory: string[];
  setSearchHistory: (searchHistory: string[]) => void;
}

const Routes: React.FC<Props> = ({ searchHistory, setSearchHistory }) => {
  return (
    <Router>
      <ReactRoutes>
        <Route
          path="/"
          element={<MainPage searchHistory={searchHistory} setSearchHistory={setSearchHistory} />}
        />
        <Route path="/history" element={<History searchHistory={searchHistory} />} />
      </ReactRoutes>
    </Router>
  );
};

export default Routes;
