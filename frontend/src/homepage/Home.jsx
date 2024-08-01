import React, { useState } from 'react'
import '../css/home/home.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Expenses from './Expenses';
import Settings from "./settings"
import Inventory from './Inventory';

function Home() {

  const [selectedPage, setSelectedPage] = useState('dashboard');

  const renderContent = () => {
    switch (selectedPage) {
      case 'expenses':
        return <Expenses />;
      case 'settings':
        return <Settings />
      case 'inventory':
        return <Inventory />
      default:
        return <Dashboard />
    }
  };

  return (
    <div className="grid-container">
      <Header />
      <Sidebar setSelectedPage={setSelectedPage} />
      {renderContent()}
    </div>
  )
}

export default Home