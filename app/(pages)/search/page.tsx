
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { books } from '@/src/mock-data';
import BookPill from '@/src/components/BookPill';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-page">
      <h1>Search Results for "{query}"</h1>
      <div className="search-page__books">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => <BookPill key={book.id} book={book} />)
        ) : (
          <p>No books found</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
