import React from 'react';
import Link from 'next/link';
import { Book } from '@/types';
import { AiFillStar } from 'react-icons/ai';
import { FaHeadphones } from 'react-icons/fa';
import './BookCard.css';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Link href={`/book/${book.id}`} className="book-card">
      {book.subscriptionRequired && <div className="book-card__premium-badge">Premium</div>}
      <figure className="book-card__image-wrapper">
        <img src={book.imageLink} alt={book.title} className="book-card__image" />
      </figure>
      <div className="book-card__content">
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__author">{book.author}</p>
        <p className="book-card__sub-title">{book.subTitle}</p>
        <div className="book-card__info">
            <div className="book-card__info-item">
                <FaHeadphones />
                <span>{formatTime(book.audioLengthInSeconds)}</span>
            </div>
            <div className="book-card__info-item">
                <AiFillStar />
                <span>{book.averageRating}</span>
            </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
