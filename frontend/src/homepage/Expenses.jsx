import React, { useState } from 'react';
import '../css/home/home.css';
import { FaPlus } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import Select from 'react-select';

function Expenses() {
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState({}); // Инициализируем как объект, где ключи - индексы проектов
  const [name, setName] = useState('');
  const [sum, setSum] = useState('');
  const [postCards, setPostCards] = useState([]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);

  function calculation() {
    if (selectedProjectIndex === null) {
      return; // Не добавляем, если проект не выбран
    }

    const currentUsers = users[selectedProjectIndex] || [];
    const newUser = { name, amount, price, sum };
    const updatedUsers = [...currentUsers, newUser];

    setUsers({
      ...users,
      [selectedProjectIndex]: updatedUsers
    });

    // Обновление общего итога
    const total = Object.values(users).flat().reduce((total, user) => total + Number(user.sum), 0);
    setTotal(total);

    // Очистка полей ввода
    setName('');
    setAmount('');
    setPrice('');
    setSum('');
  }

  const handlePriceChange = (e) => {
    const newPrice = parseFloat(e.target.value);
    if (!isNaN(newPrice)) {
      setPrice(newPrice);
      calculateTotal(newPrice, amount);
    }
  };

  const handleAmountChange = (e) => {
    const newAmount = parseInt(e.target.value);
    if (!isNaN(newAmount)) {
      setAmount(newAmount);
      calculateTotal(price, newAmount);
    }
  };

  const calculateTotal = (price, amount) => {
    const newTotal = price * amount;
    setSum(newTotal);
  };

  const handleDelete = (index) => {
    if (selectedProjectIndex === null) {
      return; // Не удаляем, если проект не выбран
    }

    const currentUsers = users[selectedProjectIndex] || [];
    const updatedUsers = currentUsers.filter((_, i) => i !== index);

    setUsers({
      ...users,
      [selectedProjectIndex]: updatedUsers
    });

    // Обновление общего итога
    const total = Object.values(users).flat().reduce((total, user) => total + Number(user.sum), 0);
    setTotal(total);
  };

  const handleTitleClick = (index) => {
    setEditingIndex(index);
    setEditTitle(postCards[index].title);
  };

  const handleTitleBlur = () => {
    if (editingIndex !== null) {
      const updatedPostCards = [...postCards];
      updatedPostCards[editingIndex] = { ...updatedPostCards[editingIndex], title: editTitle };
      setPostCards(updatedPostCards);
      setEditingIndex(null);
    }
  };

  const handleTitleChange = (e) => {
    setEditTitle(e.target.value);
  };

  const handleAddPostCard = () => {
    setPostCards([...postCards, { title: 'Новый проект' }]);
  };

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedProjectIndex(selectedOption.value);
    }
  };

  const options = postCards.map((postCard, index) => ({
    value: index,
    label: postCard.title
  }));

  const styles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'transparent',
      border: 'none',
      padding: '.3rem 2rem',
      outline: 'none',
      boxShadow: state.isFocused ? 'none' : provided.boxShadow,
      color: '#a0a0a0'
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '10px',
      backgroundColor: '#605d8d'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'transparent' : state.isFocused ? '#464366' : 'transparent',
      color: state.isSelected ? '#fff' : '#fff',
      ':active': {
        backgroundColor: '#464366',
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#a0a0a0',
    }),
    input: (provided) => ({
      ...provided,
      color: '#a0a0a0',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#a0a0a0',
    }),
    noOptionsMessage: (provided) => ({
      ...provided,
      color: '#a0a0a0',
    })
  };

  const optionsWithLastFlag = options.map((option, index) => ({
    ...option,
    isLast: index === options.length - 1
  }));

  const noOptionsMessage = () => "Проектов нет";

  return (
    <section id='dashboard-main' className='main-container'>
      <div className="expenses-list">
        <div className="add-list">
          <form action="" className='add-input-form'>
            <Select
              options={options}
              value={optionsWithLastFlag.find(option => option.value === selectedProjectIndex)}
              onChange={handleSelectChange}
              placeholder="Выберите проект"
              className="project-select"
              styles={styles}
              noOptionsMessage={noOptionsMessage}
            />
            <input
              type="text"
              placeholder='Расходник'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder='Количество'
              value={amount}
              onChange={handleAmountChange}
            />
            <input
              type="number"
              placeholder='Цена'
              value={price}
              onChange={handlePriceChange}
            />
            <input
              type="number"
              placeholder='Общая цена'
              value={sum}
              className='form-control'
              id='total_cost'
              name='total_cost'
              disabled
            />
          </form>
          <button className='btn-success' type='button' onClick={calculation}><FaPlus className='add-icon' /></button>
        </div>
        {postCards.map((postCard, index) => (
          <div key={index} className="post-card">
            <div className="post">
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
                <h2 onClick={() => handleTitleClick(index)}>{postCard.title}</h2>
              )}
              <div className="post__content">
                <table className="expense-table">
                  <thead>
                    <tr>
                      <th>Расходник</th>
                      <th>Количество</th>
                      <th>Цена</th>
                      <th>Общая цена</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(users[index] || []).map((user, idx) => (
                      <tr key={idx}>
                        <td>{user.name}</td>
                        <td>{user.amount}</td>
                        <td>{user.price}</td>
                        <td>
                          {user.sum}
                          <button onClick={() => handleDelete(idx)} className="btn-delete">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <span className="end-price">
              <h3>Общие затраты: {(users[index] || []).reduce((total, user) => total + Number(user.sum), 0)}</h3>
            </span>
          </div>
        ))}
        <div className="add-project">
          <h4 onClick={handleAddPostCard}>Добавить проект...</h4>
        </div>
      </div>
    </section>
  );
}

export default Expenses;