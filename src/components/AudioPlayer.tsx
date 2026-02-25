'use client';
import { useState, useRef, useEffect } from 'react';
import { Book } from '@/src/types';
import { FaPlay, FaPause } from 'react-icons/fa';
import { MdForward10, MdReplay10 } from "react-icons/md";
import { useUser } from '@/src/UserContext';
import { db } from '@/src/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import './AudioPlayer.css';

interface AudioPlayerProps {
  book: Book;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ book }) => {
  const { user } = useUser();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioPlayer = useRef<HTMLAudioElement>(null);
  const progressBar = useRef<HTMLInputElement>(null);
  const animationRef = useRef<number>();

  const markAsFinished = async () => {
    if (user && book) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
            finishedBooks: arrayUnion(book.id)
        });
    }
  };

  useEffect(() => {
    // Empty useEffect to avoid the error
  }, []);

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  }

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current?.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current?.pause();
      cancelAnimationFrame(animationRef.current!);
    }
  }

  const whilePlaying = () => {
    if (audioPlayer.current && progressBar.current) {
        progressBar.current.value = String(audioPlayer.current.currentTime);
        changePlayerCurrentTime();
        animationRef.current = requestAnimationFrame(whilePlaying);
    }
  }

  const changeRange = () => {
    if (audioPlayer.current && progressBar.current) {
        audioPlayer.current.currentTime = Number(progressBar.current.value);
        changePlayerCurrentTime();
    }
  }

  const changePlayerCurrentTime = () => {
    if (progressBar.current) {
        progressBar.current.style.setProperty('--seek-before-width', `${Number(progressBar.current.value) / duration * 100}%`);
        setCurrentTime(Number(progressBar.current.value));
    }
  }

  const backward10 = () => {
    if (progressBar.current) {
        const newValue = Number(progressBar.current.value) - 10;
        progressBar.current.value = String(newValue < 0 ? 0 : newValue);
        changeRange();
    }
  }

  const forward10 = () => {
    if (progressBar.current && audioPlayer.current) {
        const newValue = Number(progressBar.current.value) + 10;
        progressBar.current.value = String(newValue > duration ? duration : newValue);
        changeRange();
    }
  }

  return (
    <div className="audio-player__wrapper">
        <audio ref={audioPlayer} src={book.audioLink} preload="metadata" onLoadedMetadata={() => {
            const seconds = Math.floor(audioPlayer.current!.duration);
            setDuration(seconds);
            progressBar.current!.max = String(seconds);
        }} onEnded={markAsFinished}></audio>
        <div className="audio-player__book-info">
            <figure className="audio-player__book-image--wrapper">
                <img src={book.imageLink} alt={book.title} />
            </figure>
            <div className="audio-player__book-text">
                <div className="audio-player__book-title">{book.title}</div>
                <div className="audio-player__book-author">{book.author}</div>
            </div>
        </div>
        <div className="audio-player__main-controls">
            <button className="audio-player__btn" onClick={backward10}><MdReplay10 /></button>
            <button onClick={togglePlayPause} className="audio-player__play-pause-btn">
            {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button className="audio-player__btn" onClick={forward10}><MdForward10 /></button>
        </div>
        <div className="audio-player__progress-wrapper">
            <div className="audio-player__time">{calculateTime(currentTime)}</div>
            <input type="range" className="audio-player__progress-bar" defaultValue="0" ref={progressBar} onChange={changeRange} />
            <div className="audio-player__time">{(duration && !isNaN(duration)) && calculateTime(duration)}</div>
        </div>
    </div>
  )
}

export default AudioPlayer;
