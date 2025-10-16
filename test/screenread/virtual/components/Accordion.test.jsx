import React from 'react'
import { beforeEach, afterEach, it, describe, expect } from 'vitest'
import { VIRTUAL_SCREENREADER_RESERVED } from '../../constants'
import { virtual } from '@guidepup/virtual-screen-reader'
import { render } from '@testing-library/react'
import App from '../../../../src/App'

/*
https://www.w3.org/WAI/ARIA/apg/patterns/accordion/

WHEN I use a desktop screenreader (NVDA, JAWS, VoiceOver)
AND I use the tab key to move focus to an accordion button
- I HEAR Its purpose is clear
- I HEAR It identifies itself as a button
- I HEAR Its label is read
- I HEAR Its expanded/collapsed state
*/

describe('Accordion - Virtual Screen Reader', () => {
  afterEach(async () => {
    await virtual.stop()
  })

  beforeEach(async () => {
    const { container } = render(<App />)
    await virtual.start({ container })
  })

  describe('WHEN I use a desktop screenreader (NVDA, JAWS, VoiceOver)', () => {
    describe('AND I use the tab key to move focus to the first accordion button', () => {
      
      it('I HEAR Its purpose is clear', async () => {
        // Navega fins arribar al primer botó
        while (!(await virtual.lastSpokenPhrase()).includes('Cabecera 1')) {
          await virtual.next()
        }
        
        const spoken = await virtual.lastSpokenPhrase()
        console.log('🔊 Screen reader says:', spoken)
        
        expect(spoken).toContain('Cabecera 1')
      })

      it('I HEAR It identifies itself as a button', async () => {
        // Navega fins arribar al primer botó
        while (!(await virtual.lastSpokenPhrase()).toLowerCase().includes('button')) {
          await virtual.next()
        }
        
        const spoken = await virtual.lastSpokenPhrase()
        console.log('🔊 Screen reader says:', spoken)
        
        expect(spoken.toLowerCase()).toContain(VIRTUAL_SCREENREADER_RESERVED.BUTTON)
      })

      it('I HEAR Its label is read with the button', async () => {
        // Navega fins arribar al botó amb Cabecera 1
        while (!(await virtual.lastSpokenPhrase()).includes('Cabecera 1')) {
          await virtual.next()
        }
        
        const spoken = await virtual.lastSpokenPhrase()
        console.log('🔊 Screen reader says:', spoken)
        
        expect(spoken).toContain('Cabecera 1')
      })

      it('I HEAR Its collapsed state', async () => {
        // Navega fins arribar al botó
        while (!(await virtual.lastSpokenPhrase()).toLowerCase().includes('button')) {
          await virtual.next()
        }
        
        const spoken = await virtual.lastSpokenPhrase()
        console.log('🔊 Screen reader says:', spoken)
        
        // ✅ El Virtual Screen Reader diu "not expanded" en lloc de "collapsed"
        const isCollapsed = spoken.toLowerCase().includes('not expanded') || 
                           spoken.toLowerCase().includes(VIRTUAL_SCREENREADER_RESERVED.COLLAPSED)
        
        expect(isCollapsed).toBe(true)
      })
    })

    describe('AND I activate the accordion button', () => {
      
      it('I HEAR the expanded state', async () => {
        // Navega fins al primer botó
        while (!(await virtual.lastSpokenPhrase()).toLowerCase().includes('button')) {
          await virtual.next()
        }
        
        // Activa el botó
        await virtual.act()
        
        // ✅ Navega endavant per trobar el botó amb estat actualitzat
        let found = false
        for (let i = 0; i < 10; i++) {
          await virtual.next()
          const spoken = await virtual.lastSpokenPhrase()
          console.log('🔊 Checking:', spoken)
          
          if (spoken.toLowerCase().includes('button') && 
              spoken.toLowerCase().includes('expanded') &&
              !spoken.toLowerCase().includes('not expanded')) {
            expect(spoken.toLowerCase()).toContain(VIRTUAL_SCREENREADER_RESERVED.EXPANDED)
            found = true
            break
          }
        }
        
        // Si no troba navegant endavant, intenta tornar enrere
        if (!found) {
          for (let i = 0; i < 10; i++) {
            await virtual.previous()
            const spoken = await virtual.lastSpokenPhrase()
            console.log('🔊 Going back:', spoken)
            
            if (spoken.toLowerCase().includes('button') && 
                spoken.toLowerCase().includes('expanded') &&
                !spoken.toLowerCase().includes('not expanded')) {
              expect(spoken.toLowerCase()).toContain(VIRTUAL_SCREENREADER_RESERVED.EXPANDED)
              found = true
              break
            }
          }
        }
        
        expect(found).toBe(true)
      })

      it('I HEAR the panel content', async () => {
        // Navega fins al primer botó
        while (!(await virtual.lastSpokenPhrase()).toLowerCase().includes('button')) {
          await virtual.next()
        }
        
        // Activa el botó
        await virtual.act()
        
        // Navega pel contingut fins trobar "Lorem ipsum"
        let found = false
        for (let i = 0; i < 10; i++) {
          await virtual.next()
          const spoken = await virtual.lastSpokenPhrase()
          console.log('🔊 Reading:', spoken)
          
          if (spoken.includes('Lorem ipsum')) {
            expect(spoken).toContain('Lorem ipsum')
            found = true
            break
          }
        }
        
        expect(found).toBe(true)
      })

      it('I HEAR the region role', async () => {
        // Navega fins al primer botó
        while (!(await virtual.lastSpokenPhrase()).toLowerCase().includes('button')) {
          await virtual.next()
        }
        
        // Activa el botó
        await virtual.act()
        
        // Navega fins trobar la regió
        let found = false
        for (let i = 0; i < 10; i++) {
          await virtual.next()
          const spoken = await virtual.lastSpokenPhrase()
          console.log('🔊 Reading:', spoken)
          
          if (spoken.toLowerCase().includes(VIRTUAL_SCREENREADER_RESERVED.REGION)) {
            expect(spoken.toLowerCase()).toContain(VIRTUAL_SCREENREADER_RESERVED.REGION)
            found = true
            break
          }
        }
        
        expect(found).toBe(true)
      })
    })

    describe('AND I navigate between accordion items', () => {
      it('I can navigate to all accordion buttons', async () => {
        const foundButtons = []
        
        // Navega per tot el contingut
        for (let i = 0; i < 30; i++) {
          await virtual.next()
          const spoken = await virtual.lastSpokenPhrase()
          
          if (spoken.toLowerCase().includes('button') && spoken.includes('Cabecera')) {
            console.log('🔊 Found button:', spoken)
            foundButtons.push(spoken)
          }
        }
        
        expect(foundButtons.length).toBeGreaterThanOrEqual(3)
        expect(foundButtons.some(s => s.includes('Cabecera 1'))).toBeTruthy()
        expect(foundButtons.some(s => s.includes('Cabecera 2'))).toBeTruthy()
        expect(foundButtons.some(s => s.includes('Cabecera 3'))).toBeTruthy()
      })
    })

    describe('Container accessibility', () => {
      it('I HEAR the container label', async () => {
        await virtual.next()
        const spoken = await virtual.lastSpokenPhrase()
        console.log('🔊 Container:', spoken)
        
        expect(spoken.toLowerCase()).toContain(VIRTUAL_SCREENREADER_RESERVED.LIST)
      })
    })
  })
})