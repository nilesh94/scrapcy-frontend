// src/App.js
import React from 'react';
import './App.css'; // Your main App styles
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './components/HomePage/HomePage';

function App() {
  return (
    <div className="App">
      <Header /> 
      <main>
        <HomePage /> 
      </main>
      <Footer />
    </div>
  );
}

export default App;
