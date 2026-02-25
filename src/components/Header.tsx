'use client';
import SearchBar from './SearchBar';
import { FaBars } from 'react-icons/fa';
import './Header.css';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <button className="header__toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <div className="header__search-wrapper">
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;
