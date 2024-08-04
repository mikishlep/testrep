import React, { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { useSpring, animated } from "react-spring";

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

    // Состояние для хранения записей таблицы
    const [expenses, setExpenses] = useState([]);
    // Состояние для хранения значений инпутов
    const [inputValues, setInputValues] = useState({
        month: '',
        income: '',
        expenses: '',
        grossProfit: '',
        netProfit: '',
    });

    // Функция для обработки изменения инпутов
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Функция для добавления записи
    const handleAddExpense = () => {
        const currentYear = new Date().getFullYear(); // Получение текущего года

        setExpenses((prev) => [
            ...prev,
            {
                name: inputValues.month,
                amount: inputValues.income,
                price: inputValues.expenses,
                sum: inputValues.grossProfit,
                netProfit: inputValues.netProfit,
                year: currentYear, // Добавление года в данные записи
            }
        ]);
        // Очистить инпуты
        setInputValues({
            month: '',
            income: '',
            expenses: '',
            grossProfit: '',
            netProfit: '',
        });
    };

    // Функция для удаления записи
    const handleDeleteExpense = (index) => {
        setExpenses((prev) => prev.filter((_, i) => i !== index));
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
                            {expenses.length > 0 && (
                                <thead>
                                    <tr>
                                        <th>Месяц</th>
                                        <th>Доходы</th>
                                        <th>Расходы</th>
                                        <th>Валовая прибыль</th>
                                        <th>Чистая прибыль</th>
                                        <th>Год</th> {/* Добавлен столбец для года */}
                                        <th>Действие</th>
                                    </tr>
                                </thead>
                            )}
                            <tbody>
                                {expenses.map((expense, index) => (
                                    <tr key={index}>
                                        <td>{expense.name}</td>
                                        <td>{expense.amount}</td>
                                        <td>{expense.price}</td>
                                        <td>{expense.sum}</td>
                                        <td>{expense.netProfit}</td>
                                        <td>{expense.year}</td> {/* Отображение года */}
                                        <td>
                                            <button onClick={() => handleDeleteExpense(index)} className="btn-delete">
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