import React from 'react'
import '../css/home/home.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';

function Home() {
  return (
    <div className="grid-container">
      <Header />
      <Sidebar />
      <Dashboard />
    </div>
  )
}

export default Home