import React, { useState } from 'react'
import '../css/home/home.css';
import { FaPlus } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";

function Inventory() {
  return (
    <section id='dashboard-main' className='main-container'>
        <div className="expenses-list">
            <div className="add-list">
                <form action="" className='add-input-form'>
                    <input type="text" placeholder='Название проекта' />
                    <input type="text" placeholder='Расходник' />
                    <input type="text" placeholder='Количество' />
                    <input type="text" placeholder='Цена' />
                </form>
                <FaPlus className='add-icon' />
            </div>
            <div className="post-card">
              <div className="post">
                <h2>Тема проекта</h2>
                <div className="post__content">
                  
                </div>
              </div>
              <span className="end-price">
                <h3>Общие затраты: 35000</h3>
              </span>
            </div>
        </div>
    </section>
  )
}

export default Inventory