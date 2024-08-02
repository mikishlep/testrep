import React, { useState } from 'react';
import '../css/home/home.css';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Select from 'react-select';

function Expenses({ searchQuery }) {
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState({});
  const [name, setName] = useState('');
  const [sum, setSum] = useState('');
  const [postCards, setPostCards] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);

  function calculation() {
    if (selectedProjectIndex === null) {
      return;
    }

    const currentUsers = users[selectedProjectIndex] || [];
    const newUser = { name, amount, price, sum };
    const updatedUsers = [...currentUsers, newUser];

    setUsers({
      ...users,
      [selectedProjectIndex]: updatedUsers
    });

    const total = Object.values(users).flat().reduce((total, user) => total + Number(user.sum), 0);
    setTotal(total);

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
      return;
    }

    const currentUsers = users[selectedProjectIndex] || [];
    const updatedUsers = currentUsers.filter((_, i) => i !== index);

    setUsers({
      ...users,
      [selectedProjectIndex]: updatedUsers
    });

    const total = Object.values(users).flat().reduce((total, user) => total + Number(user.sum), 0);
    setTotal(total);
  };

  const handleDeletePostCard = (index) => {
    if (window.confirm("Удалить проект?")) {
      // Remove the selected project
      const updatedPostCards = postCards.filter((_, i) => i !== index);
      setPostCards(updatedPostCards);

      // Remove associated users data
      const updatedUsers = { ...users };
      delete updatedUsers[index];
      const newUsers = {};
      Object.keys(updatedUsers).forEach(key => {
        const newIndex = parseInt(key) < index ? parseInt(key) : parseInt(key) - 1;
        newUsers[newIndex] = updatedUsers[key];
      });
      setUsers(newUsers);

      // Adjust selected project index
      if (selectedProjectIndex === index) {
        setSelectedProjectIndex(null);
      } else if (selectedProjectIndex > index) {
        setSelectedProjectIndex(selectedProjectIndex - 1);
      }
    } else {
      return;
    }
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

  // Generate options with updated indices
  const options = postCards.map((postCard, index) => ({
    value: index,
    label: postCard.title
  }));

  // Фильтрация проектов по запросу поиска
  const filteredPostCards = postCards.filter(postCard =>
    postCard.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {filteredPostCards.map((postCard, index) => (
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
            <button onClick={() => handleDeletePostCard(index)} className="btn-delete-postcard">
              <FaTrash />
            </button>
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