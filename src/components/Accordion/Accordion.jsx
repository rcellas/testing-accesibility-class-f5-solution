import React, { useState } from 'react'
import './Accordion.css'
// ...existing code...
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
            <ul aria-label="Acordeón accesible amb llista" className="accordion-controls">
                {items.map((item, i) => {
                    const isOpen = openIndex === i
                    const buttonId = `accordion-control-${i + 1}`
                    return (
                        <li key={item.id}>
                            <h3>
                                <button
                                    id={buttonId}
                                    aria-controls={item.id}
                                    aria-expanded={isOpen}
                                    onClick={() => toggle(i)}
                                >
                                    {item.title}
                                </button>
                            </h3>
                            <div
                                id={item.id}
                                role="region"
                                aria-labelledby={buttonId}
                                aria-hidden={!isOpen}
                            >
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