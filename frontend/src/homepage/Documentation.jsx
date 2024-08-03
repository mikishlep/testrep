import React from 'react'
import '../css/home/home.css';

function Documentation() {
  return (
    <section id='dashboard-main' className='main-container'>
        <div className="documentation-block">
            <h1>Статистика</h1>
            <ol className='documentation'>
                <li>
                    Чтобы отредактировать данные статистики, подведите мышку под левый нижний угол второго графика и нажмите на кнопку для появления
                    дополнительного меню.
                </li>
            </ol>
        </div>
        <div className="documentation-block">
            <h1>Затраты</h1>
            <ol className='documentation'>
                <li>
                    Чтобы добавить позицию в проект, нажмите "Добавить проект...", выберите проект в выпадающем меню, заполните данные и нажмите 
                    на кнопку <strong>"➕".</strong>
                </li>
                <li>
                    Чтобы удалить позицию в проекте, нажмите на корзину у нужного пункта проекта.
                </li>
                <li>
                    Для изменения названия проекта, нажмите на "Название проекта" и введите нужное вам название.
                </li>
                <li>
                    Чтобы удалить проект, нажмите крестик справа от названия.
                </li>
            </ol>
        </div>
        <div className="documentation-block">
            <h1>Инвентарь</h1>
            <ol className='documentation'>
                <li>
                    Чтобы добавить позицию в инвентарь, нажмите <strong>"➕".</strong>.
                </li>
                <li>
                    Чтобы удалить позицию в проекте, доведите количество вещи в инвентаре до нуля и нажмите минус ещё раз.
                </li>
                <li>
                    Для изменения названия проекта, нажмите на название и введите нужное вам.
                </li>
            </ol>
        </div>
    </section>
  )
}

export default Documentation