'use client';

import React, { useState } from 'react';
import './AuthModal.css';
import { auth } from '@/src/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useUser } from '@/src/UserContext';
import { db } from '@/src/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { FaUser, FaTimes } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const AuthModal = () => {
  const { closeModal } = useUser();
  const router = useRouter();
  const [authType, setAuthType] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/for-you');
      closeModal();
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-email') {
        setError('Invalid email or password.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/for-you');
      closeModal();
    } catch (error) {
      setError('Failed to login with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, 'guest@gmail.com', 'guest123');
      router.push('/for-you');
      closeModal();
    } catch (error) {
      setError('Could not log in as guest. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        savedBooks: [],
        finishedBooks: [],
      });
      router.push('/for-you');
      closeModal();
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            setError('An account with this email already exists.');
        } else if (error.code === 'auth/invalid-email') {
            setError('Please enter a valid email address.');
        } else {
            setError('An unexpected error occurred. Please try again.');
        }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setError('Password reset email sent. Please check your inbox.');
      setAuthType('login');
    } catch (error) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
            setError('No user found with this email.');
        } else {
            setError('Failed to send password reset email. Please try again.');
        }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="modal__backdrop">
        <div className="modal__container">
            <button className="modal__close-btn" onClick={closeModal}><FaTimes /></button>
            {authType === 'login' && (
                <div className='modal__content'>
                    <h2 className='modal__title'>Log in to Summarist</h2>
                    {error && <p className="modal__error">{error}</p>}
                    <button className="modal__btn modal__btn--guest" onClick={handleGuestLogin} disabled={loading}>
                        <FaUser /> Login as a Guest
                    </button>
                    <div className='modal__separator'><span>or</span></div>
                    <button className="modal__btn modal__btn--google" onClick={handleGoogleLogin} disabled={loading}>
                        <FcGoogle /> Login with Google
                    </button>
                    <div className='modal__separator'><span>or</span></div>
                    <form onSubmit={handleLogin} className="modal__form">
                        <input className='modal__input' type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input className='modal__input' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type="submit" className="modal__btn modal__btn--login" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                    </form>
                    <a className='modal__link' onClick={() => setAuthType('forgotPassword')}>Forgot your password?</a>
                    <a className='modal__link' onClick={() => setAuthType('register')}>Don't have an account?</a>
                </div>
            )}
            {authType === 'register' && (
                <div className='modal__content'>
                    <h2 className='modal__title'>Sign up to Summarist</h2>
                    {error && <p className="modal__error">{error}</p>}
                    <form onSubmit={handleRegister} className="modal__form">
                        <input className='modal__input' type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input className='modal__input' type="password" placeholder="Password (min. 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <input className='modal__input' type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        <button type="submit" className="modal__btn modal__btn--login" disabled={loading}>{loading ? 'Signing up...' : 'Sign up'}</button>
                    </form>
                    <a className='modal__link' onClick={() => setAuthType('login')}>Already have an account?</a>
                </div>
            )}
            {authType === 'forgotPassword' && (
                <div className='modal__content'>
                    <h2 className='modal__title'>Reset Password</h2>
                    <p className='modal__text'>Enter your email to receive a password reset link.</p>
                    {error && <p className="modal__error">{error}</p>}
                    <form onSubmit={handlePasswordReset} className="modal__form">
                        <input className='modal__input' type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <button type="submit" className="modal__btn modal__btn--login" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</button>
                    </form>
                    <a className='modal__link' onClick={() => setAuthType('login')}>Back to login</a>
                </div>
            )}
        </div>
    </div>
  );
};

export default AuthModal;
