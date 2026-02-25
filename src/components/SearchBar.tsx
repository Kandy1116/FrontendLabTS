'use client';
import { useState, useEffect, useRef } from 'react';
import { Book } from '@/types';
import Link from 'next/link';
import './SearchBar.css';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setIsDropdownOpen(false);
      return;
    }
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${query}`);
        const data = await response.json();
        setResults(data);
        setIsDropdownOpen(true);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
      setLoading(false);
    };

    const timeoutId = setTimeout(fetchBooks, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="search__wrapper" ref={searchRef}>
      <div className="search__input-container">
        <input 
            className="search__input" 
            placeholder="Search for books" 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setIsDropdownOpen(true)}
        />
        <FaSearch className="search__icon" />
      </div>
        {isDropdownOpen && (
            <div className="search__results-wrapper">
                {loading && <div className="search__loading">Loading...</div>}
                {!loading && results.length > 0 && (
                    <div className="search__results">
                    {results.map((book) => (
                        <Link href={`/book/${book.id}`} key={book.id} className="search__result-item" onClick={() => setIsDropdownOpen(false)}>
                        <figure className="search__result-image--wrapper">
                            <img src={book.imageLink} alt={book.title} />
                        </figure>
                        <div className="search__result-text">
                            <div className="search__result-title">{book.title}</div>
                            <div className="search__result-author">{book.author}</div>
                        </div>
                        </Link>
                    ))}
                    </div>
                )}
                {!loading && results.length === 0 && (
                    <div className="search__no-results">No books found.</div>
                )}
            </div>
        )}
    </div>
  );
};

export default SearchBar;
