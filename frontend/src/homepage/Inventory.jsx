import React, { useState } from 'react';
import '../css/home/home.css';
import { FaPlus } from 'react-icons/fa';
import { CiSquarePlus, CiSquareMinus } from "react-icons/ci";

function Inventory({ searchQuery }) {
  const [cards, setCards] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [count, setCount] = useState(0);

  const addCard = () => {
    const newId = cards.length ? cards[cards.length - 1].id + 1 : 1;
    setCards([
      ...cards,
      { id: newId, title: 'Новая карточка', count: count }
    ]);
  };

  const handleTitleClick = (index) => {
    setEditingIndex(index);
    setEditTitle(cards[index].title);
  };

  const handleTitleChange = (e) => {
    setEditTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (editingIndex !== null) {
      const updatedCards = [...cards];
      updatedCards[editingIndex] = { ...updatedCards[editingIndex], title: editTitle };
      setCards(updatedCards);
      setEditingIndex(null);
    }
  };

  const filteredCards = cards.filter(card =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const increaseCount = (id) => {
    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, count: card.count + 1 } : card
    );
    setCards(updatedCards);
  };
  
  const decreaseCount = (id) => {
    const updatedCards = cards.map(card => {
      if (card.id === id) {
        const newCount = card.count - 1;
        if (newCount < 0) {
          // Удаление карточки, если count становится меньше 0
          return null; // Возвращаем null, чтобы потом отфильтровать её
        }
        return { ...card, count: newCount };
      }
      return card;
    }).filter(card => card !== null); // Удаление всех null значений из массива
  
    setCards(updatedCards);
  };
  

  return (
    <section id='dashboard-main' className='main-container'>
      <div className="inventory-cards">
        {filteredCards.map((card, index) => (
          <div key={card.id} className="inv-card">
            <div className="card-inner">
              <div className="inv-header">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    autoFocus
                    className='edit-title-input'
                  />
                ) : (
                  <h3 onClick={() => handleTitleClick(index)}>{card.title}</h3>
                )}
              </div>
            </div>
            <div className="inv-count">
              <h1>{card.count}</h1>
              <CiSquareMinus className='inv-button' onClick={() => decreaseCount(card.id)} />
              <CiSquarePlus className='inv-button' onClick={() => increaseCount(card.id)} />
            </div>
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