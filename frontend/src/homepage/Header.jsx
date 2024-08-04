import React, { useState } from 'react'; // Импортируем useState
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify } from 'react-icons/bs';
import '../css/home/home.css';
import LogoutButton from '../LogoutButton';

function Header({ onSearch, currentPage }) {
  const [query, setQuery] = useState(''); // Состояние для запроса

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery); // Обновляем состояние
    // В зависимости от текущей страницы, вызываем соответствующую функцию поиска
    if (currentPage === 'inventory' || currentPage === 'expenses') {
      onSearch(newQuery);
    }
  };

  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className='icon' />
      </div>
      <div className="header-left">
        <BsSearch className='icon' />
        <form className='search-form'>
          <input 
            type="text" 
            className='search-input' 
            placeholder='Поиск' 
            value={query} 
            onChange={handleSearchChange} // Устанавливаем обработчик изменения
          />
        </form>
      </div>
      <div className="header-right">
        <button className='hero-btn logout'>
        <LogoutButton />
        </button>
      </div>
    </header>
  );
}

export default Header;