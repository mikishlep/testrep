import React, { useState, useEffect } from 'react';
import '../css/home/home.css';
import { FaPlus } from 'react-icons/fa';
import { CiSquarePlus, CiSquareMinus } from "react-icons/ci";
import axios from 'axios';

const apiURL = process.env.REACT_APP_API;

function Inventory({ searchQuery }) {
  const [cards, setCards] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiURL}/cards`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCards(response.data);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, []);

  const addCard = async () => {
    const newCard = { title: 'Новая карточка', count: count };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiURL}/cards`, newCard, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCards([...cards, { ...newCard, id: response.data.id }]);
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  const handleTitleClick = (index) => {
    setEditingIndex(index);
    setEditTitle(cards[index].title);
  };

  const handleTitleChange = (e) => {
    setEditTitle(e.target.value);
  };

  const handleTitleBlur = async () => {
    if (editingIndex !== null) {
      const updatedCard = { ...cards[editingIndex], title: editTitle };

      try {
        const token = localStorage.getItem('token');
        await axios.put(`${apiURL}/cards/${updatedCard.id}`, updatedCard, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const updatedCards = [...cards];
        updatedCards[editingIndex] = updatedCard;
        setCards(updatedCards);
        setEditingIndex(null);
      } catch (error) {
        console.error('Error updating card:', error);
      }
    }
  };

  const increaseCount = async (id) => {
    try {
        const updatedCard = cards.find(card => card.id === id);
        if (updatedCard) {
            updatedCard.count += 1;
            console.log('Increasing count for card:', updatedCard); // Логирование перед запросом
            const token = localStorage.getItem('token');
            await axios.put(`${apiURL}/cards/${id}`, { count: updatedCard.count }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Updated card count:', updatedCard); // Логирование после запроса
            const updatedCards = cards.map(card =>
                card.id === id ? updatedCard : card
            );
            setCards(updatedCards);
        }
    } catch (error) {
        console.error('Error increasing count:', error);
    }
  };

  const decreaseCount = async (id) => {
    try {
        const updatedCard = cards.find(card => card.id === id);
        if (updatedCard) {
            if (updatedCard.count > 0) {
                // Уменьшить счётчик
                updatedCard.count -= 1;
                console.log('Decreasing count for card:', updatedCard); // Логирование перед запросом
                const token = localStorage.getItem('token');
                await axios.put(`${apiURL}/cards/${id}`, { count: updatedCard.count }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('Updated card count:', updatedCard); // Логирование после запроса
                const updatedCards = cards.map(card =>
                    card.id === id ? updatedCard : card
                );
                setCards(updatedCards);
            } else if (updatedCard.count === 0) {
                // Удаление карточки
                console.log('Removing card with id:', id); // Логирование перед запросом
                const token = localStorage.getItem('token');
                await axios.delete(`${apiURL}/cards/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCards(cards.filter(card => card.id !== id));
            }
        }
    } catch (error) {
        console.error('Error decreasing count:', error);
    }
};

  const filteredCards = cards.filter(card =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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