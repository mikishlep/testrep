import React, { useState, useEffect } from 'react';
import '../css/home/home.css';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import Select from 'react-select';
import axios from 'axios';

function Expenses({ searchQuery }) {
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState(0);
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [sum, setSum] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8081/projects', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Ошибка при получении проектов:', error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectIndex === null) return;

    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8081/expenses/${selectedProjectIndex}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setExpenses(response.data);
        const total = response.data.reduce((total, expense) => total + Number(expense.sum), 0);
        setTotal(total);
      } catch (error) {
        console.error('Ошибка при получении расходов:', error);
      }
    };

    fetchExpenses();
  }, [selectedProjectIndex]);

  const calculation = () => {
    if (selectedProjectIndex === null) return;

    const newExpense = { name, amount, price, sum };
    const updatedExpenses = [...expenses, newExpense];

    setExpenses(updatedExpenses);
    setTotal(updatedExpenses.reduce((total, expense) => total + Number(expense.sum), 0));

    const token = localStorage.getItem('token');
    axios.post('http://localhost:8081/expenses', { 
      projectId: selectedProjectIndex, 
      name, 
      amount, 
      price, 
      sum 
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .catch(error => console.error('Ошибка при добавлении расхода:', error));

    setName('');
    setAmount('');
    setPrice('');
    setSum('');
  };

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

  const handleDelete = (expenseId) => {
    if (window.confirm("Удалить расход?")) {
      setExpenses(expenses.filter(expense => expense.id !== expenseId));
      setTotal(total - expenses.find(expense => expense.id === expenseId).sum);

      const token = localStorage.getItem('token');
      axios.delete(`http://localhost:8081/expenses/${expenseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(error => console.error('Ошибка при удалении расхода:', error));
    }
  };

  const handleDeleteProject = (index) => {
    if (window.confirm("Удалить проект?")) {
      const deletedProject = projects[index];
      setProjects(projects.filter((_, i) => i !== index));
      setExpenses(expenses.filter(expense => expense.project_id !== deletedProject.id));
      setSelectedProjectIndex(null);

      const token = localStorage.getItem('token');
      axios.delete(`http://localhost:8081/projects/${deletedProject.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(error => console.error('Ошибка при удалении проекта:', error));
    }
  };

  const handleTitleClick = (index) => {
    setEditingIndex(index);
    setEditTitle(projects[index].title);
  };

  const handleTitleBlur = async () => {
    if (editingIndex !== null) {
      const updatedProject = { ...projects[editingIndex], title: editTitle };
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:8081/projects/${updatedProject.id}`, updatedProject, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const updatedProjects = [...projects];
        updatedProjects[editingIndex] = updatedProject;
        setProjects(updatedProjects);
        setEditingIndex(null);
      } catch (error) {
        console.error('Ошибка при обновлении проекта:', error);
      }
    }
  };

  const handleTitleChange = (e) => {
    setEditTitle(e.target.value);
  };

  const handleAddProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const newProject = { title: 'Новый проект' };
      const response = await axios.post('http://localhost:8081/projects', newProject, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const addedProject = { ...newProject, id: response.data.id };
      setProjects([...projects, addedProject]);
    } catch (error) {
      console.error('Ошибка при добавлении проекта:', error);
    }
  };

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedProjectIndex(selectedOption.value);
    }
  };

  // Генерируем опции с обновленными индексами
  const options = projects.map((project, index) => ({
    value: project.id,
    label: project.title
  }));

  // Фильтрация проектов по запросу поиска
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        {filteredProjects.map((project, index) => (
          <div key={index} className="post-card">
            <div className="post">
              <div className="post-header">
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
                  <h2 onClick={() => handleTitleClick(index)}>{project.title}</h2>
                )}
                <button onClick={() => handleDeleteProject(index)} className="btn-delete-postcard">
                  <FaTimes />
                </button>
              </div>
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
                    {expenses.filter(expense => expense.project_id === project.id).map((expense, expenseIdx) => (
                      <tr key={expenseIdx}>
                        <td>{expense.name}</td>
                        <td>{expense.amount}</td>
                        <td>{expense.price}</td>
                        <td>
                          {expense.sum}
                          <button onClick={() => handleDelete(expense.id)} className="btn-delete">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <span className="end-price">
                <h3>Общие затраты: {expenses.filter(expense => expense.project_id === project.id).reduce((total, expense) => total + Number(expense.sum), 0)}</h3>
              </span>
            </div>
          </div>
        ))}
        <div className="add-project">
          <h4 onClick={handleAddProject}>Добавить проект...</h4>
        </div>
      </div>
    </section>
  );
}

export default Expenses;