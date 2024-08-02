import React, { useState } from 'react'; // Импортируем useState
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify } from 'react-icons/bs';
import '../css/home/home.css';

function Header({ onSearch }) {
  const [query, setQuery] = useState(''); // Добавляем состояние query

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery); // Обновляем состояние query
    onSearch(newQuery); // Вызываем функцию обратного вызова с новым значением
  };

  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className='icon' />
      </div>
      <div className="header-left">
        <BsSearch className='icon' />
        <form action="" className='search-form'>
          <input 
            type="text" 
            className='search-input' 
            placeholder='Поиск' 
            value={query} // Добавляем значение состояния query
            onChange={handleSearchChange} // Устанавливаем обработчик изменения
          />
        </form>
      </div>
      <div className="header-right">
        <BsFillBellFill className='icon' />
        <BsFillEnvelopeFill className='icon' />
        <BsPersonCircle className='icon' />
      </div>
    </header>
  )
}

export default Header;