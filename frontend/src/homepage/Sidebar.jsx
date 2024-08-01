import React from 'react'
import '../css/home/home.css';
import { BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill } from 'react-icons/bs';
import { TbAbacus } from "react-icons/tb";

function Sidebar({setSelectedPage}) {
  return (
    <aside id='sidebar'>
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <TbAbacus className='icon_header' /> GRASTONE
        </div>
        <span className="icon close_icon">✕</span>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item" onClick={() => setSelectedPage('dashboard')}>
            <BsGrid1X2Fill className='icon' /> Статистика
        </li>
        <li className="sidebar-list-item">
            <BsFillArchiveFill className='icon' /> Products
        </li>
        <li className="sidebar-list-item" onClick={() => setSelectedPage('expenses')}>
            <BsFillGrid3X3GapFill className='icon' /> Затраты
        </li>
        <li className="sidebar-list-item">
            <BsPeopleFill className='icon' /> Customers
        </li>
        <li className="sidebar-list-item" onClick={() => setSelectedPage('inventory')}>
            <BsListCheck className='icon' /> Инвентарь
        </li>
        <li className="sidebar-list-item">
            <BsMenuButtonWideFill className='icon' /> Reports
        </li>
        <li className="sidebar-list-item" onClick={() => setSelectedPage('settings')}>
            <BsFillGearFill className='icon' /> Настройки
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar