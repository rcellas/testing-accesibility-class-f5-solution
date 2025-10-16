import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accordion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Keyboard Interaction', () => {
    // https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
    
    test('Tab: Moves focus between accordion headers', async ({ page }) => {
      const buttons = page.locator('button')
      
      await page.keyboard.press('Tab')
      await expect(buttons.first()).toBeFocused()
      
      await page.keyboard.press('Tab')
      await expect(buttons.nth(1)).toBeFocused()
    })

    test('Enter and Space: Toggle accordion section', async ({ page }) => {
      const button = page.locator('button').first()
      
      await button.focus()
      await expect(button).toHaveAttribute('aria-expanded', 'false')
      
      await page.keyboard.press('Enter')
      await expect(button).toHaveAttribute('aria-expanded', 'true')
      
      await page.keyboard.press('Space')
      await expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  test.describe('WAI-ARIA Roles, States, and Properties', () => {
    // https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
    
    test('Has proper heading structure with buttons', async ({ page }) => {
      const headings = page.locator('h3')
      await expect(headings).toHaveCount(3)
      
      const buttons = page.locator('h3 button')
      await expect(buttons).toHaveCount(3)
    })

    test('Buttons have required ARIA attributes', async ({ page }) => {
      const button = page.locator('button').first()
      
      await expect(button).toHaveAttribute('aria-expanded', 'false')
      await expect(button).toHaveAttribute('aria-controls', 'content-1')
    })

    test('Panels have required ARIA attributes', async ({ page }) => {
      const content = page.locator('#content-1')
      const button = page.locator('button').first()
      const buttonId = await button.getAttribute('id')
      
      await expect(content).toHaveAttribute('role', 'region')
      await expect(content).toHaveAttribute('aria-hidden', 'true')
      await expect(content).toHaveAttribute('aria-labelledby', buttonId)
    })
  })

  test.describe('Behavior', () => {
    test('Toggle section updates ARIA states and visibility', async ({ page }) => {
      const button = page.locator('button').first()
      const content = page.locator('#content-1')
      
      await button.click()
      await expect(button).toHaveAttribute('aria-expanded', 'true')
      await expect(content).toHaveAttribute('aria-hidden', 'false')
      await expect(content).toBeVisible()
      
      await button.click()
      await expect(button).toHaveAttribute('aria-expanded', 'false')
      await expect(content).toHaveAttribute('aria-hidden', 'true')
    })

    test('Only one section can be expanded at a time', async ({ page }) => {
      const buttons = page.locator('button')
      
      await buttons.first().click()
      await expect(buttons.first()).toHaveAttribute('aria-expanded', 'true')
      
      await buttons.nth(1).click()
      await expect(buttons.first()).toHaveAttribute('aria-expanded', 'false')
      await expect(buttons.nth(1)).toHaveAttribute('aria-expanded', 'true')
    })
  })

  test.describe('Accessibility Compliance', () => {
    test('Passes WCAG 2.1 AA automated tests', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .include('.accordion')
        .withTags(['wcag2aa'])
        .analyze()

      expect(results.violations).toEqual([])
    })

    test('Has visible focus indicator', async ({ page }) => {
      const button = page.locator('button').first()
      await button.focus()
      
      const focusStyles = await button.evaluate(el => {
        const computed = window.getComputedStyle(el)
        return {
          outlineWidth: computed.outlineWidth,
          outlineStyle: computed.outlineStyle,
          boxShadow: computed.boxShadow
        }
      })
      
      const hasFocusIndicator = 
        (focusStyles.outlineWidth !== '0px' && focusStyles.outlineStyle !== 'none') ||
        (focusStyles.boxShadow !== 'none' && focusStyles.boxShadow !== '')
      
      expect(hasFocusIndicator).toBeTruthy()
    })

    test('Text size meets minimum requirement (14px)', async ({ page }) => {
      const button = page.locator('button').first()
      
      const fontSize = await button.evaluate(el => {
        return parseInt(window.getComputedStyle(el).fontSize)
      })
      
      expect(fontSize).toBeGreaterThanOrEqual(14)
    })
  })
})