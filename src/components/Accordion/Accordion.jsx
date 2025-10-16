import { useState } from 'react'
import './Accordion.css'

function Accordion() {
    const items = [
        { id: 'content-1', title: 'Cabecera 1', body: 'Lorem ipsum dolor sit amet' },
        { id: 'content-2', title: 'Cabecera 2', body: 'Lorem ipsum dolor sit amet' },
        { id: 'content-3', title: 'Cabecera 3', body: 'Lorem ipsum dolor sit amet' }
    ]

    const [openIndex, setOpenIndex] = useState(null)

    const toggle = (index) => {
        setOpenIndex(prev => (prev === index ? null : index))
    }

    return (
        <div className="accordion">
            <ul className="accordion-controls">
                {items.map((item, i) => {
                    const isOpen = openIndex === i
                    return (
                        <li key={item.id}>
                            <h3>
                                <button onClick={() => toggle(i)}>
                                    {item.title}
                                </button>
                            </h3>
                            <div id={item.id}>
                                <p>{item.body}</p>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
export default Accordion