import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertTriangle, Clock, LogOut, RefreshCw } from 'lucide-react';

// TIMINGS (In Milliseconds)
const WARNING_TIME = 10 * 60 * 1000; // 10 Minutes (Time until warning appears)
const LOGOUT_TIME = 2 * 60 * 1000;   // 2 Minutes (Time to answer warning)

const SessionTimeout = () => {
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds for display
  const navigate = useNavigate();
  
  // Refs to hold timer IDs
  const warnTimeoutRef = useRef(null);
  const logoutTimeoutRef = useRef(null);
  const intervalRef = useRef(null);

  // --- 1. LOGOUT FUNCTION ---
  const logoutUser = useCallback(() => {
    console.log("Auto-logging out due to inactivity...");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear all timers
    if (warnTimeoutRef.current) clearTimeout(warnTimeoutRef.current);
    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    setIsWarningModalOpen(false);
    navigate('/login');
    window.location.reload(); // Force refresh to clear state
  }, [navigate]);

  // --- 2. SHOW WARNING MODAL ---
  const warnUser = () => {
    // Check if user is even logged in
    if (!localStorage.getItem('token')) return;

    setIsWarningModalOpen(true);
    setTimeLeft(120); // Reset visual countdown
    
    // Start countdown for visual display
    intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
    }, 1000);

    // Set hard limit for logout
    logoutTimeoutRef.current = setTimeout(logoutUser, LOGOUT_TIME);
  };

  // --- 3. RESET TIMERS (Activity Detected) ---
  const resetTimers = useCallback(() => {
    // If modal is open, DO NOT reset automatically. User must click "Continue".
    if (isWarningModalOpen) return;

    if (warnTimeoutRef.current) clearTimeout(warnTimeoutRef.current);
    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);

    // Only start timer if user is logged in
    if (localStorage.getItem('token')) {
        warnTimeoutRef.current = setTimeout(warnUser, WARNING_TIME);
    }
  }, [isWarningModalOpen, logoutUser]);

  // --- 4. "CONTINUE SESSION" CLICKED ---
  const continueSession = async () => {
    // Stop the logout timers
    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    setIsWarningModalOpen(false);
    
    // Optional: Ping backend to ensure Token is actually still valid
    try {
        const token = localStorage.getItem('token');
        if(token) {
            // Simple ping to keep backend session alive or verify token
            // Using your existing endpoint structure
            await axios.get(
                `${process.env.REACT_APP_API_URL || 'https://scrapcy-backend-new-1.onrender.com'}/users/me`, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
        }
        resetTimers(); // Restart the 10 min loop
    } catch (err) {
        console.error("Session actually expired:", err);
        logoutUser(); // If token is dead, logout immediately
    }
  };

  // --- 5. EVENT LISTENERS ---
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    
    // Attach listeners
    events.forEach(event => window.addEventListener(event, resetTimers));
    
    // Init timer
    resetTimers();

    // Cleanup
    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimers));
      if (warnTimeoutRef.current) clearTimeout(warnTimeoutRef.current);
      if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetTimers]);

  if (!isWarningModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy/90 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-t-8 border-orange overflow-hidden p-8 text-center">
        
        <div className="inline-flex p-4 bg-orange/10 text-orange rounded-full mb-6 animate-pulse">
            <Clock size={48} strokeWidth={1.5} />
        </div>

        <h2 className="text-2xl font-black text-navy uppercase tracking-tight mb-2">
            Session Expiring
        </h2>
        
        <p className="text-steel mb-6">
            You have been inactive for a while. For your security, you will be logged out automatically in:
        </p>

        <div className="text-4xl font-black text-orange tabular-nums mb-8">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>

        <div className="flex gap-3">
            <button 
                onClick={logoutUser}
                className="flex-1 py-3 border-2 border-platinum text-steel font-bold uppercase rounded-lg hover:border-red-500 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
            >
                <LogOut size={18} /> Logout
            </button>
            <button 
                onClick={continueSession}
                className="flex-1 py-3 bg-navy text-white font-bold uppercase rounded-lg shadow-lg hover:bg-orange transition-all flex items-center justify-center gap-2"
            >
                <RefreshCw size={18} /> Continue
            </button>
        </div>

      </div>
    </div>
  );
};

export default SessionTimeout;
