'use client';
import { useState, useEffect, useRef } from 'react';
import { Book } from '@/types';
import Link from 'next/link';
import './Search.css';
import { FaSearch } from 'react-icons/fa';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${query}`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
      setLoading(false);
    };

    const debounceTimer = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <div className="search__content">
        <div className="search">
            <div className="search__input--wrapper">
                <input 
                    className="search__input" 
                    placeholder="Search for books" 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className="search__icon">
                    <FaSearch />
                </div>
            </div>
        </div>
        {query && (
            <div className="search__results-wrapper">
                {loading && <div className="search__loading">Loading...</div>}
                {!loading && results.length > 0 && (
                    <div className="search__results">
                    {results.map((book) => (
                        <Link href={`/book/${book.id}`} key={book.id} className="search__result-item">
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

export default Search;
