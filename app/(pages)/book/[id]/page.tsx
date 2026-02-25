'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Book } from '@/types';
import "./book.css";
import { AiFillStar } from "react-icons/ai";
import {
  FaBookmark,
  FaRegBookmark,
  FaHeadphones,
  FaBookOpen,
  FaRegLightbulb,
} from "react-icons/fa";
import Skeleton from "@/src/components/Skeleton";
import { useUser } from "@/src/UserContext";
import { db } from "@/src/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";

const BookPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);
  const router = useRouter();
  const { user, openModal } = useUser();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );
        const data = await res.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!user || !id) {
        setIsSaved(false);
        return;
      }
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setIsSaved(userData.savedBooks && userData.savedBooks.includes(id));
        } else {
          setIsSaved(false);
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
        setIsSaved(false);
      }
    };
    checkSavedStatus();
  }, [id, user]);

  const handleInteraction = (action: 'read' | 'listen') => {
    if (!user) {
      openModal();
      return;
    }
    if (book?.subscriptionRequired) {
      // Assuming we'll add subscription status to the user object later
      router.push("/choose-plan");
    } else {
      router.push(action === 'listen' ? `/player/${id}` : `/reader/${id}`); // Assuming a /reader route
    }
  };

  const toggleSaved = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openModal();
      return;
    }

    const newSavedState = !isSaved;
    setIsSaved(newSavedState);

    const userDocRef = doc(db, "users", user.uid);
    try {
      if (newSavedState) {
        await updateDoc(userDocRef, {
          savedBooks: arrayUnion(id),
        });
      } else {
        await updateDoc(userDocRef, {
          savedBooks: arrayRemove(id),
        });
      }
    } catch (error) {
      console.error("Error updating saved status:", error);
      setIsSaved(!newSavedState); // Revert on error
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="book__wrapper">
      {loading ? (
        <div className="book__container--skeleton">
          <div className="book__main-content--skeleton">
            <div className="book__content--skeleton">
              <Skeleton width="70%" height="36px" />
              <Skeleton width="40%" height="20px" />
              <Skeleton width="100%" height="80px" />
              <div className="book__details-grid--skeleton">
                  {Array(4).fill(0).map((_, i) => <Skeleton key={i} width="100%" height="40px" />)}
              </div>
              <div className="book__actions--skeleton">
                  <Skeleton width="120px" height="48px" />
                  <Skeleton width="120px" height="48px" />
              </div>
              <Skeleton width="200px" height="48px" />
            </div>
            <figure className="book__image--wrapper-skeleton">
              <Skeleton width="300px" height="300px" />
            </figure>
          </div>
          <div className="book__description-section--skeleton">
              <Skeleton width="200px" height="28px" />
              <Skeleton width="100%" height="120px" />
          </div>
          <div className="book__description-section--skeleton">
              <Skeleton width="200px" height="28px" />
              <Skeleton width="100%" height="120px" />
          </div>
        </div>
      ) : book ? (
        <div className="book__container">
          <div className="book__main-content">
            <div className="book__content">
              <h1 className="book__title">
                {book.title}
                {book.subscriptionRequired && (
                  <span className="book__premium-tag"> (Premium)</span>
                )}
              </h1>
              <p className="book__author">{book.author}</p>
              <p className="book__sub-title">{book.subTitle}</p>
              <div className="book__details-grid">
                <div className="book__details-item">
                  <div className="book__details-icon">
                    <AiFillStar />
                  </div>
                  <span className="book__details-text">
                    {book.averageRating} ({book.totalRating} ratings)
                  </span>
                </div>
                <div className="book__details-item">
                  <div className="book__details-icon">
                    <FaHeadphones />
                  </div>
                  <span className="book__details-text">
                    {formatTime(book.audioLengthInSeconds)} 
                  </span>
                </div>
                <div className="book__details-item">
                  <div className="book__details-icon">
                    <FaBookOpen />
                  </div>
                  <span className="book__details-text">Audio & Text</span>
                </div>
                <div className="book__details-item">
                  <div className="book__details-icon">
                    <FaRegLightbulb />
                  </div>
                  <span className="book__details-text">
                    {book.keyIdeas} Key ideas
                  </span>
                </div>
              </div>
              <div className="book__actions">
                <button onClick={() => handleInteraction('read')} className="book__action-btn book__read-btn">
                    <div className="book__action-icon">
                        <FaBookOpen />
                    </div>
                    <span>Read</span>
                </button>
                <button onClick={() => handleInteraction('listen')} className="book__action-btn book__listen-btn">
                  <div className="book__action-icon">
                    <FaHeadphones />
                  </div>
                  <span>Listen</span>
                </button>
              </div>
              <button onClick={toggleSaved} className={`book__add-to-library-btn ${isSaved ? 'book__saved' : ''}`}>
                <div className="book__save-icon">
                  {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                </div>
                <span>{isSaved ? "Saved in My Library" : "Add title to My Library"}</span>
              </button>
            </div>
            <figure className="book__image--wrapper">
              <img
                src={book.imageLink}
                alt={book.title}
                className="book__image"
              />
            </figure>
          </div>
          <div className="book__description-section">
            <h2 className="book__description-heading">What's it about?</h2>
            <div className="book__tags-wrapper">
                {book.tags.map(tag => (
                    <div key={tag} className="book__tag">{tag}</div>
                ))}
            </div>
            <p className="book__description-text">{book.summary}</p>
          </div>
          <div className="book__description-section">
            <h2 className="book__description-heading">About the author</h2>
            <p className="book__description-text">{book.authorDescription}</p>
          </div>
        </div>
      ) : (
        <div>Book not found.</div>
      )}
    </div>
  );
};

export default BookPage; 
