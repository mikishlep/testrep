import React, { PureComponent } from 'react'
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
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

    const moneyData = [
        {
          name: 'Январь',
          расходы: 0,
          доходы: 0,
          amt: 2400,
        },
        {
          name: 'Февраль',
          расходы: 0,
          доходы: 0,
          amt: 2210,
        },
        {
          name: 'Март',
          расходы: 0,
          доходы: 0,
          amt: 2290,
        },
        {
          name: 'Апрель',
          расходы: 0,
          доходы: 0,
          amt: 2000,
        },
        {
          name: 'Май',
          расходы: 0,
          доходы: 0,
          amt: 2181,
        },
        {
          name: 'Июнь',
          расходы: 0,
          доходы: 0,
          amt: 2500,
        },
        {
          name: 'Июль',
          расходы: 0,
          доходы: 0,
          amt: 2100,
        },
        {
          name: 'Август',
          расходы: 0,
          доходы: 0,
          amt: 2100,
        },
        {
          name: 'Сентябрь',
          расходы: 0,
          доходы: 0,
          amt: 2100,
        },
        {
          name: 'Октябрь',
          расходы: 0,
          доходы: 0,
          amt: 2100,
        },
        {
          name: 'Ноябрь',
          расходы: 0,
          доходы: 0,
          amt: 2100,
        },
        {
          name: 'Декабрь',
          расходы: 0,
          доходы: 0,
          amt: 2100,
        }
    ];

    const profitData = [
        {
          name: 'Январь',
          чистая_прибыль: 0,
          валовая_прибыль: 0,
          amt: 2400,
        },
        {
          name: 'Февраль',
          чистая_прибыль: 0,
          валовая_прибыль: 0,
          amt: 2210,
        },
        {
          name: 'Март',
          чистая_прибыль: 0,
          валовая_прибыль: 0,
          amt: 2290,
        },
        {
          name: 'Апрель',
          чистая_прибыль: 0,
          валовая_прибыль: 0,
          amt: 2000,
        },
        {
          name: 'Май',
          чистая_прибыль: 0,
          валовая_прибыль: 0,
          amt: 2181,
        },
        {
          name: 'Июнь',
          чистая_прибыль: 0,
          валовая_прибыль: 0,
          amt: 2500,
        },
        {
          name: 'Июль',
          чистая_прибыль: 0,
          валовая_прибыль: 0,
          amt: 2100,
        },
        {
          name: 'Август',
          чистая_прибыль: 0,
          валовая_прибыль: 0,
          amt: 2100,
        },
        {
          name: 'Сентябрь',
          чистая_прибыль: 0,
          валовая_прибыль: 0,
          amt: 2100,
        },
        {
          name: 'Октябрь',
          чистая_прибыль: 0,
          валовая_прибыль: 0,
          amt: 2100,
        },
        {
          name: 'Ноябрь',
          чистая_прибыль: 0,
          валовая_прибыль: 0,
          amt: 2100,
        },
        {
          name: 'Декабрь',
          чистая_прибыль: 0,
          валовая_прибыль: 0,
          amt: 2100,
        }
    ];

  return (
    <section id='dashboard-main' className='main-container'>
        <div className="main-cards">
            <div className="card">
                <div className="card-inner">
                    <h3>ПАМЯТНИКИ</h3>
                    <BsFillArchiveFill className='card_icon' />
                </div>
                <h1>
                    <Number n={1} />
                </h1>
            </div>
            <div className="card">
                <div className="card-inner">
                    <h3>ВАЗОНЫ</h3>
                    <BsFillGrid3X3GapFill className='card_icon' />
                </div>
                <h1>
                    <Number n={2} />
                </h1>
            </div>
            <div className="card">
                <div className="card-inner">
                    <h3>СТОЛЕШНИЦЫ</h3>
                    <BsPeopleFill className='card_icon' />
                </div>
                <h1>
                    <Number n={0} />
                </h1>
            </div>
            <div className="card">
                <div className="card-inner">
                    <h3>РАКОВИНЫ</h3>
                    <BsFillBellFill className='card_icon' />
                </div>
                <h1>
                    <Number n={0} />
                </h1>
            </div>
        </div>

        <div className="charts">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={moneyData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="доходы" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                    <Bar dataKey="расходы" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={profitData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="чистая_прибыль" stroke="#8884d8" activeDot={{ r: 12 }} />
                    <Line type="monotone" dataKey="валовая_прибыль" stroke="#82ca9d" />
                </LineChart>
        </ResponsiveContainer>
        </div>
    </section>
  )
}

export default Dashboard