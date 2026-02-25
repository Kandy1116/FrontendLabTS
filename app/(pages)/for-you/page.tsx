'use client';
import React, { useState, useEffect, useRef } from 'react';
import BookPill from '@/src/components/BookPill';
import Skeleton from '@/src/components/Skeleton';
import { Book } from '@/src/types/book';
import './for-you.css';
import { BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/src/UserContext';

const ForYouPage = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, openModal } = useUser();
  const router = useRouter();
  const [activeAudio, setActiveAudio] = useState<{ id: string; audioLink: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
        openModal();
        return;
    }

    if (book.subscriptionRequired) { 
        router.push('/choose-plan');
        return;
    }

    if (activeAudio?.id === book.id) {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            audioRef.current?.play();
            setIsPlaying(true);
        }
    } else {
        setActiveAudio({ id: book.id, audioLink: book.audioLink });
    }
  };

  useEffect(() => {
    if (activeAudio) {
        audioRef.current?.load();
        audioRef.current?.play().then(() => {
            setIsPlaying(true);
        }).catch(error => {
            console.error("Audio play failed", error);
            setIsPlaying(false);
        });
    }
  }, [activeAudio]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const [selectedRes, recommendedRes, suggestedRes] = await Promise.all([
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected'),
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended'),
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested'),
        ]);
        
        const selectedData = await selectedRes.json();
        const recommendedData = await recommendedRes.json();
        const suggestedData = await suggestedRes.json();

        setSelectedBook(selectedData[0]);
        setRecommendedBooks(recommendedData);
        setSuggestedBooks(suggestedData);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="for-you__wrapper">
        <div className="for-you__container">
            {loading ? (
                <div className="for-you__container--skeleton">
                    {/* Skeleton for "Selected just for you" */}
                    <div className="foryou__title"><Skeleton width="240px" height="32px" /></div>
                    <div className="selected-book__wrapper--skeleton">
                        <div className="selected-book__details--skeleton">
                            <figure className="selected-book__image--wrapper-skeleton">
                                <Skeleton width="140px" height="140px" />
                            </figure>
                            <div className="selected-book__text--skeleton">
                                <Skeleton width="200px" height="24px" />
                                <Skeleton width="150px" height="20px" />
                                <Skeleton width="100px" height="28px" />
                            </div>
                        </div>
                    </div>

                    {/* Skeleton for "Recommended For You" */}
                    <div className="foryou__title"><Skeleton width="280px" height="32px" /></div>
                    <div className="foryou__sub-title"><Skeleton width="200px" height="20px" /></div>
                    <div className="foryou__books-grid">
                        {Array(3).fill(0).map((_, i) => (
                            <div className="book-pill--skeleton" key={i}>
                                <Skeleton width="100%" height="200px" />
                                <Skeleton width="80%" height="20px" />
                                <Skeleton width="60%" height="16px" />
                            </div>
                        ))}
                    </div>

                    {/* Skeleton for "Suggested Books" */}
                    <div className="foryou__title"><Skeleton width="220px" height="32px" /></div>
                    <div className="foryou__sub-title"><Skeleton width="180px" height="20px" /></div>
                    <div className="foryou__books-grid">
                        {Array(3).fill(0).map((_, i) => (
                            <div className="book-pill--skeleton" key={i}>
                                <Skeleton width="100%" height="200px" />
                                <Skeleton width="80%" height="20px" />
                                <Skeleton width="60%" height="16px" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <div className="foryou__title">Selected just for you</div>
                    {selectedBook && (
                        <Link href={`/book/${selectedBook.id}`} className="selected-book__link">
                            <div className="selected-book__wrapper">
                                <div className="selected-book__sub-title">{selectedBook.subTitle}</div>
                                <div className="selected-book__details">
                                    <figure className="selected-book__image--wrapper">
                                        <img src={selectedBook.imageLink} alt={selectedBook.title} className="selected-book__image" />
                                    </figure>
                                    <div className="selected-book__text">
                                        <div className="selected-book__title">{selectedBook.title}</div>
                                        <div className="selected-book__author">{selectedBook.author}</div>
                                        <button className="selected-book__audio" onClick={(e) => handlePlay(e, selectedBook)}>
                                            <div className="selected-book__play-icon">
                                                {isPlaying && activeAudio?.id === selectedBook.id ? <BsFillPauseFill /> : <BsFillPlayFill />}
                                            </div>
                                            <span>{selectedBook.audioLength} mins</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    <div className="foryou__title">Recommended For You</div>
                    <div className="foryou__sub-title">We think you'll like these</div>
                    <div className="foryou__books-grid">
                        {recommendedBooks.map(book => <BookPill key={book.id} book={book} />)}
                    </div>

                    <div className="foryou__title">Suggested Books</div>
                    <div className="foryou__sub-title">Browse those books</div>
                    <div className="foryou__books-grid">
                        {suggestedBooks.map(book => <BookPill key={book.id} book={book} />)}
                    </div>
                    <audio ref={audioRef} src={activeAudio?.audioLink} onEnded={() => setIsPlaying(false)} />
                </>
            )}
        </div>
    </div>
  );
};

export default ForYouPage;
