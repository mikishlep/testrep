import React, { useState } from 'react';
import '../css/home/home.css';
import { FaPlus } from 'react-icons/fa';

function Inventory() {
  const [cards, setCards] = useState([]);

  const addCard = () => {
    const newId = cards.length ? cards[cards.length - 1].id + 1 : 1;
    setCards([
      ...cards,
      { id: newId, title: 'Новая карточка', count: 0 }
    ]);
  };

  return (
    <section id='dashboard-main' className='main-container'>
      <div className="inventory-cards">
        {cards.map(card => (
          <div key={card.id} className="inv-card">
            <div className="card-inner">
              <h3>{card.title}</h3>
            </div>
            <h1>{card.count}</h1>
          </div>
        ))}
        <button onClick={addCard}>
          <FaPlus className='inventory-plus' />
        </button>
      </div>
    </section>
  );
}

export default Inventory;