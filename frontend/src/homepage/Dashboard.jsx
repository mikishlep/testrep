import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
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
};

function Dashboard() {
    const [moneyData, setMoneyData] = useState([
        { name: 'Январь', расходы: 0, доходы: 0, amt: 2400 },
        { name: 'Февраль', расходы: 0, доходы: 0, amt: 2210 },
        { name: 'Март', расходы: 0, доходы: 0, amt: 2290 },
        { name: 'Апрель', расходы: 0, доходы: 0, amt: 2000 },
        { name: 'Май', расходы: 0, доходы: 0, amt: 2181 },
        { name: 'Июнь', расходы: 0, доходы: 0, amt: 2500 },
        { name: 'Июль', расходы: 0, доходы: 0, amt: 2100 },
        { name: 'Август', расходы: 0, доходы: 0, amt: 2100 },
        { name: 'Сентябрь', расходы: 0, доходы: 0, amt: 2100 },
        { name: 'Октябрь', расходы: 0, доходы: 0, amt: 2100 },
        { name: 'Ноябрь', расходы: 0, доходы: 0, amt: 2100 },
        { name: 'Декабрь', расходы: 0, доходы: 0, amt: 2100 }
    ]);

    const [profitData, setProfitData] = useState([
        { name: 'Январь', чистая_прибыль: 0, валовая_прибыль: 0, amt: 2400 },
        { name: 'Февраль', чистая_прибыль: 0, валовая_прибыль: 0, amt: 2210 },
        { name: 'Март', чистая_прибыль: 0, валовая_прибыль: 0, amt: 2290 },
        { name: 'Апрель', чистая_прибыль: 0, валовая_прибыль: 0, amt: 2000 },
        { name: 'Май', чистая_прибыль: 0, валовая_прибыль: 0, amt: 2181 },
        { name: 'Июнь', чистая_прибыль: 0, валовая_прибыль: 0, amt: 2500 },
        { name: 'Июль', чистая_прибыль: 0, валовая_прибыль: 0, amt: 2100 },
        { name: 'Август', чистая_прибыль: 0, валовая_прибыль: 0, amt: 2100 },
        { name: 'Сентябрь', чистая_прибыль: 0, валовая_прибыль: 0, amt: 2100 },
        { name: 'Октябрь', чистая_прибыль: 0, валовая_прибыль: 0, amt: 2100 },
        { name: 'Ноябрь', чистая_прибыль: 0, валовая_прибыль: 0, amt: 2100 },
        { name: 'Декабрь', чистая_прибыль: 0, валовая_прибыль: 0, amt: 2100 }
    ]);

    const [editing, setEditing] = useState(false); // Состояние для показа/скрытия формы ввода данных

    const handleChangeMoneyData = (index, field, value) => {
        const updatedData = [...moneyData];
        updatedData[index] = { ...updatedData[index], [field]: +value };
        setMoneyData(updatedData);
    };

    const handleChangeProfitData = (index, field, value) => {
        const updatedData = [...profitData];
        updatedData[index] = { ...updatedData[index], [field]: +value };
        setProfitData(updatedData);
    };

    const [cardData, setCardData] = useState([
        { title: 'ПАМЯТНИКИ', count: 1 },
        { title: 'ВАЗОНЫ', count: 2 },
        { title: 'СТОЛЕШНИЦЫ', count: 0 },
        { title: 'РАКОВИНЫ', count: 0 },
    ]);

    const handleChangeCardData = (index, field, value) => {
        const updatedData = [...cardData];
        updatedData[index] = { ...updatedData[index], [field]: +value };
        setCardData(updatedData);
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
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={moneyData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="доходы" fill="#8884d8" />
                        <Bar dataKey="расходы" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={profitData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="чистая_прибыль" stroke="#8884d8" />
                        <Line type="monotone" dataKey="валовая_прибыль" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <button onClick={() => setEditing(!editing)} className="edit-button">
                {editing ? "Скрыть форму ввода" : "Изменить графики"}
            </button>

            {editing && (
                <div className="graphics">
                    <div className="paint-graphic">
                        <h3>ДОХОДЫ - РАСХОДЫ</h3>
                        {moneyData.map((data, index) => (
                            <div key={index}>
                                <h4>{data.name}</h4>
                                <input
                                    type="number"
                                    value={data.доходы}
                                    onChange={(e) => handleChangeMoneyData(index, 'доходы', e.target.value)}
                                    placeholder="Доходы"
                                    className='graphic-config'
                                />
                                <input
                                    type="number"
                                    value={data.расходы}
                                    onChange={(e) => handleChangeMoneyData(index, 'расходы', e.target.value)}
                                    placeholder="Расходы"
                                    className='graphic-config'
                                />
                            </div>
                        ))}
                    </div>
                    <div className="paint-graphic">
                        <h3>ЧИСТАЯ - ВАЛОВАЯ</h3>
                        {profitData.map((data, index) => (
                            <div key={index}>
                                <h4>{data.name}</h4>
                                <input
                                    type="number"
                                    value={data.чистая_прибыль}
                                    onChange={(e) => handleChangeProfitData(index, 'чистая_прибыль', e.target.value)}
                                    placeholder="Чистая прибыль"
                                    className='graphic-config'
                                />
                                <input
                                    type="number"
                                    value={data.валовая_прибыль}
                                    onChange={(e) => handleChangeProfitData(index, 'валовая_прибыль', e.target.value)}
                                    placeholder="Валовая прибыль"
                                    className='graphic-config'
                                />
                            </div>
                        ))}
                    </div>
                    <div className="paint-graphic-left">
                        <h3>ИЗМЕНИТЬ КАРТОЧКИ</h3>
                        {cardData.map((card, index) => (
                            <div key={index}>
                                <h4>{card.title}</h4>
                                <input
                                    type="number"
                                    value={card.count}
                                    onChange={(e) => handleChangeCardData(index, 'count', e.target.value)}
                                    placeholder="Количество"
                                    className='graphic-config'
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

export default Dashboard;