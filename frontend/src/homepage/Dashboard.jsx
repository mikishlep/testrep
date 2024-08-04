import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { useSpring, animated } from "react-spring";
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import axios from 'axios';

function Number({ n }) {
    const { number } = useSpring({
        from: { number: 0 },
        number: n,
        delay: 200,
        config: { mass: 1, tension: 20, friction: 10 },
    });

    return <animated.div>{number.to((n) => n.toFixed(0))}</animated.div>;
};

function Dashboard() {

    const [cardData, setCardData] = useState([
        { title: 'ПАМЯТНИКИ', count: 1 },
        { title: 'ВАЗОНЫ', count: 2 },
        { title: 'СТОЛЕШНИЦЫ', count: 0 },
        { title: 'РАКОВИНЫ', count: 0 },
    ]);

    return (
        <section id='dashboard-main' className='main-container'>
            <div className="main-cards">
                {cardData.map((card, index) => (
                    <div className="card" key={index}>
                        <div className="card-inner">
                            <h3>{card.title}</h3>
                            {card.title === 'ПАМЯТНИКИ' && <BsFillArchiveFill className='card_icon' />}
                            {card.title === 'ВАЗОНЫ' && <BsFillGrid3X3GapFill className='card_icon' />}
                            {card.title === 'СТОЛЕШНИЦЫ' && <BsPeopleFill className='card_icon' />}
                            {card.title === 'РАКОВИНЫ' && <BsFillBellFill className='card_icon' />}
                        </div>
                        <h1>
                            <Number n={card.count} />
                        </h1>
                    </div>
                ))}
            </div>

            <div className="charts">
                <div className="expenses-list">
                    <div className="add-list">
                        <form className='add-input-form'>
                            <input
                            type="text"
                            placeholder='Месяц'
                            />
                            <input
                            type="number"
                            placeholder='Доходы'
                            />
                            <input
                            type="number"
                            placeholder='Расходы'
                            />
                            <input
                            type="number"
                            placeholder='Валовая прибыль'
                            className='form-control'
                            id='total_cost'
                            name='total_cost'
                            disabled
                            />
                            <input
                            type="number"
                            placeholder='Чистая прибыль'
                            />
                        </form>
                        <button className='btn-success' type='button'>
                            <FaPlus className='add-icon' />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Dashboard;