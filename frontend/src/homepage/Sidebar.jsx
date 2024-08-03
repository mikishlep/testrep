import React from 'react'
import '../css/home/home.css';
import { BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill } from 'react-icons/bs';
import { TbAbacus } from "react-icons/tb";
import { FaTelegram } from "react-icons/fa";
import { SlSocialVkontakte } from "react-icons/sl";

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
        <li className="sidebar-list-item" onClick={() => setSelectedPage('expenses')}>
            <BsFillGrid3X3GapFill className='icon' /> Затраты
        </li>
        <li className="sidebar-list-item" onClick={() => setSelectedPage('inventory')}>
            <BsListCheck className='icon' /> Инвентарь
        </li>
        <li className="sidebar-list-item" onClick={() => setSelectedPage('documentation')}>
            <BsMenuButtonWideFill className='icon' /> Документация
        </li>
        <li className="sidebar-no-hover">
          <a href="https://t.me/grastone"><FaTelegram className='icon' /></a>
          <a href="https://vk.com/grastone"><SlSocialVkontakte className='icon' /></a>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar