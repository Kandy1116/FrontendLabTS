import React from 'react';
import Link from 'next/link';
import { Book } from '@/src/types';
import { AiOutlineClockCircle, AiFillStar } from 'react-icons/ai';
import './BookPill.css';

interface BookPillProps {
  book: Book;
}

const BookPill: React.FC<BookPillProps> = ({ book }) => {
  return (
    <Link href={`/book/${book.id}`} className="book-pill__link">
      <div className="book-pill__container">
        {book.subscriptionRequired && <div className="book-pill__premium">Premium</div>}
                    <figure className="book-pill__image--wrapper">
                        <img src={book.imageLink} alt={book.title} className="book-pill__image" />
                    </figure>
        <div className="book-pill__details">
          <div className="book-pill__title">{book.title}</div>
          <div className="book-pill__author">{book.author}</div>
          <div className="book-pill__sub-title">{book.subTitle}</div>
          <div className="book-pill__info">
            <div className="book-pill__info-item">
              <AiOutlineClockCircle />
              <span>03:24</span>
            </div>
            <div className="book-pill__info-item">
              <AiFillStar />
              <span>{book.averageRating}</span>
            </div>
            {book.subscriptionRequired && (
              <div className="book-pill__premium">Premium</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookPill;
