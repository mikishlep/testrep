import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { useSpring, animated } from "react-spring";
import axios from 'axios';

function Number({ n }) {
    const { number } = useSpring({
        from: { number: 0 },
        number: n,
        delay: 200,
        config: { mass: 1, tension: 20, friction: 10 },
    });

    return <animated.div>{number.to((n) => n.toFixed(0))}</animated.div>;
}

function Dashboard() {
    
    const [cardData, setCardData] = useState([
        { title: 'ПАМЯТНИКИ', count: 1 },
        { title: 'ВАЗОНЫ', count: 2 },
        { title: 'СТОЛЕШНИЦЫ', count: 0 },
        { title: 'РАКОВИНЫ', count: 0 },
    ]);

    const [inputValues, setInputValues] = useState({
        month: '',
        income: '',
        expenses: '',
        grossProfit: '',
        netProfit: '',
    });
    const [dashboardStats, setDashboardStats] = useState([]);

    useEffect(() => {
        const fetchCardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8081/dashboard-stat', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setDashboardStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };

        fetchCardData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddExpense = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:8081/dashboard-stat', {
                month: inputValues.month,
                income: inputValues.income,
                expenses: inputValues.expenses,
                grossProfit: inputValues.grossProfit,
                netProfit: inputValues.netProfit
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Refresh data
            const response = await axios.get('http://localhost:8081/dashboard-stat', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDashboardStats(response.data);
        } catch (error) {
            console.error('Error adding dashboard record:', error);
        }

        // Clear inputs
        setInputValues({
            month: '',
            income: '',
            expenses: '',
            grossProfit: '',
            netProfit: '',
        });
    };

    const handleDeleteExpense = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/dashboard-stat/${id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            // Refresh data
            const response = await axios.get('http://localhost:8081/dashboard-stat', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setDashboardStats(response.data);
        } catch (error) {
            console.error('Error deleting dashboard record:', error);
            alert('Failed to delete record. Please try again.');
        }
    };

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
                                name="month"
                                value={inputValues.month}
                                placeholder='Месяц'
                                onChange={handleInputChange}
                            />
                            <input
                                type="number"
                                name="income"
                                value={inputValues.income}
                                placeholder='Доходы'
                                onChange={handleInputChange}
                            />
                            <input
                                type="number"
                                name="expenses"
                                value={inputValues.expenses}
                                placeholder='Расходы'
                                onChange={handleInputChange}
                            />
                            <input
                                type="number"
                                name="grossProfit"
                                value={inputValues.grossProfit}
                                placeholder='Валовая прибыль'
                                onChange={handleInputChange}
                            />
                            <input
                                type="number"
                                name="netProfit"
                                value={inputValues.netProfit}
                                placeholder='Чистая прибыль'
                                onChange={handleInputChange}
                            />
                        </form>
                        <button className='btn-success' type='button' onClick={handleAddExpense}>
                            <FaPlus className='add-icon' />
                        </button>
                    </div>

                    {/* Таблица */}
                    <div className="post__content">
                        <table className="expense-table dashboard-table">
                            {dashboardStats.length > 0 && (
                                <thead>
                                    <tr>
                                        <th>Месяц</th>
                                        <th>Доходы</th>
                                        <th>Расходы</th>
                                        <th>Валовая прибыль</th>
                                        <th>Чистая прибыль</th>
                                        <th>Год</th>
                                        <th>Действие</th>
                                    </tr>
                                </thead>
                            )}
                            <tbody>
                                {dashboardStats.map((record) => (
                                    <tr key={record.id}>
                                        <td>{record.month}</td>
                                        <td>{record.income}</td>
                                        <td>{record.expenses}</td>
                                        <td>{record.grossProfit}</td>
                                        <td>{record.netProfit}</td>
                                        <td>{record.year}</td>
                                        <td>
                                            <button onClick={() => handleDeleteExpense(record.id)} className="btn-delete">
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Dashboard;