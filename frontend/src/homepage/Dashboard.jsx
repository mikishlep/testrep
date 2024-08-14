import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { useSpring, animated } from "react-spring";
import axios from 'axios';

const apiURL = process.env.REACT_APP_API;

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
    const [inputValues, setInputValues] = useState({
        month: '',
        income: '',
        expenses: '',
        grossProfit: '',
        netProfit: '',
    });

    const [userNotes, setUserNotes] = useState([]);
    const [dashboardStats, setDashboardStats] = useState([]);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${apiURL}/dashboard-stat`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setDashboardStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };

        const fetchUserNotes = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${apiURL}/notes`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUserNotes(response.data);
            } catch (error) {
                console.error('Error fetching user notes:', error);
            }
        };

        fetchUserNotes();
        fetchDashboardStats();
    }, []);

    const handleAddNote = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${apiURL}/notes`, {
                note: inputValues.notes
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Refresh notes
            const response = await axios.get(`${apiURL}/notes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUserNotes(response.data);
        } catch (error) {
            console.error('Error adding note:', error);
        }

        // Clear note input
        setInputValues(prev => ({
            ...prev,
            notes: ''
        }));
    };

    const handleDeleteNote = async (id) => {
        try {
            await axios.delete(`${apiURL}/notes/${id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            // Refresh notes
            const response = await axios.get(`${apiURL}/notes`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setUserNotes(response.data);
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

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
            await axios.post(`${apiURL}/dashboard-stat`, {
                month: inputValues.month,
                income: inputValues.income,
                expenses: inputValues.expenses,
                grossProfit: inputValues.grossProfit,
                netProfit: inputValues.netProfit
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Refresh data
            const response = await axios.get(`${apiURL}/dashboard-stat`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDashboardStats(response.data);
        } catch (error) {
            console.error('Error adding dashboard record:', error);
        }

        // Clear inputs
        setInputValues({
            month: '',
            grossProfit: '',
            netProfit: '',
        });
    };

    const handleTextAreaChange = (e) => {
        const { name, value } = e.target;
        setInputValues((prev) => ({
            ...prev,
            [name]: value
        }));
    
        // Automatically adjust the height of the textarea
        const textarea = e.target;
        textarea.style.height = 'auto'; // Reset height to auto to get the scrollHeight correctly
        textarea.style.height = `${textarea.scrollHeight}px`; // Set height to the scrollHeight
    };    

    const handleDeleteExpense = async (id) => {
        try {
            await axios.delete(`${apiURL}/dashboard-stat/${id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            // Refresh data
            const response = await axios.get(`${apiURL}/dashboard-stat`, {
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
            {/* Cards section (commented out) */}
            {/* <div className="main-cards">
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
            </div> */}

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

            <div className="notes">
                <textarea
                    className='notes-input'
                    value={inputValues.notes}
                    onChange={handleInputChange}
                    name='notes'
                    placeholder='Введите заметки...'
                ></textarea>
                <button className='btn-success' type='button' onClick={handleAddNote}>
                    <button className='hero-btn note-btn'>Создать заметку</button>
                </button>
                <ul className='notes-ul'>
                    {userNotes.map((note) => (
                        <li key={note.id} className='note-li'>
                            {note.note}
                            <button onClick={() => handleDeleteNote(note.id)} className="btn-delete">
                                <FaTrash />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default Dashboard;