import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { RecoilRoot } from 'recoil'; // Import RecoilRoot
import MainPage from './Components/mainPage/MainPage';
import History from './Components/historyPage/History';import './App.css';
import "./App.css"

function App() {
  return (
    <RecoilRoot> {/* */}
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/history">History</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </RecoilRoot>
  );
}

export default App;
