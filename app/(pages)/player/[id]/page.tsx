'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Book } from '@/src/types';
import Skeleton from "@/src/components/Skeleton";
import AudioPlayer from "@/src/components/AudioPlayer";
import "./player.css";

const PlayerPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
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

    if (id) {
      fetchBook();
    }
  }, [id]);

  return (
    <div className="player__wrapper">
        <div className="player__container">
            {loading ? (
                <div className="player__container--skeleton">
                <Skeleton width="100%" height="100%" />
                </div>
            ) : book ? (
                <>
                    <div className="player__book-details">
                        <h1 className="player__book-title">{book.title}</h1>
                        <p className="player__book-summary" style={{ whiteSpace: "pre-line" }}>
                            {book.summary}
                        </p>
                    </div>
                    <AudioPlayer book={book} />
                </>
            ) : (
                <div>Book not found.</div>
            )}
        </div>
    </div>
  );
};

export default PlayerPage;
