import React from 'react'
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify } from 'react-icons/bs';
import '../css/home/home.css';

function Header() {
  return (
    <header className="header">
        <div className="menu-icon">
            <BsJustify className='icon' />
        </div>
        <div className="header-left">
            <BsSearch className='icon' />
            <form action="" className='search-form'>
              <input type="any" className='search-input' placeholder='Поиск' />
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

export default Header