// src/App.js
import React from 'react';
// REMOVED: import './App.css'; // This file does not exist and caused the error
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './components/HomePage/HomePage';

function App() {
  return (
    <div className="App">
      <Header /> 
      <main>
        {/* HomePage will contain the hero section and coming soon features */}
        <HomePage /> 
      </main>
      <Footer />
    </div>
  );
}

export default App;
