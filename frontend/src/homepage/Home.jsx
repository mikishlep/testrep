import React, { useEffect, useState } from 'react';
import '../css/home/home.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Expenses from './Expenses';
import Inventory from './Inventory';
import Documentation from './Documentation';

function Home() {
  const [selectedPage, setSelectedPage] = useState(() => {
    const savedPage = localStorage.getItem('selectedPage');
    return savedPage ? savedPage : 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('selectedPage', selectedPage);
  }, [selectedPage]);

  const [searchQuery, setSearchQuery] = useState('');

  const renderContent = () => {
    switch (selectedPage) {
      case 'expenses':
        return <Expenses searchQuery={searchQuery} />;
      case 'inventory':
        return <Inventory searchQuery={searchQuery} />;
      case 'dashboard':
        return <Dashboard />;
      case 'documentation':
        return <Documentation />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="grid-container">
      <Header onSearch={setSearchQuery} currentPage={selectedPage} />
      <Sidebar setSelectedPage={setSelectedPage} />
      {renderContent()}
    </div>
  );
}

export default Home;