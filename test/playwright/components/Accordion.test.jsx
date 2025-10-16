import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accordion - Accessibilitat', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('no ha de tenir problemes d\'accessibilitat (axe-core)', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })

  test.describe('Atributs ARIA', () => {
    test('botons tancats tenen aria-expanded="false"', async ({ page }) => {
      const buttons = page.locator('button')
      await expect(buttons.first()).toHaveAttribute('aria-expanded', 'false')
      await expect(buttons.nth(1)).toHaveAttribute('aria-expanded', 'false')
      await expect(buttons.nth(2)).toHaveAttribute('aria-expanded', 'false')
    })

    test('botons tenen aria-controls correcte', async ({ page }) => {
      const buttons = page.locator('button')
      await expect(buttons.first()).toHaveAttribute('aria-controls', 'content-1')
      await expect(buttons.nth(1)).toHaveAttribute('aria-controls', 'content-2')
      await expect(buttons.nth(2)).toHaveAttribute('aria-controls', 'content-3')
    })

    test('contingut tancat té aria-hidden="true"', async ({ page }) => {
      const content = page.locator('#content-1')
      await expect(content).toHaveAttribute('aria-hidden', 'true')
      await expect(content).toHaveAttribute('role', 'region')
    })

    test('al clicar canvia aria-expanded i aria-hidden', async ({ page }) => {
      const button = page.locator('button').first()
      const content = page.locator('#content-1')
      
      await button.click()
      await expect(button).toHaveAttribute('aria-expanded', 'true')
      await expect(content).toHaveAttribute('aria-hidden', 'false')
    })
  })

  test.describe('Comportament', () => {
    test('només una secció oberta alhora', async ({ page }) => {
      const buttons = page.locator('button')
      
      await buttons.first().click()
      await expect(buttons.first()).toHaveAttribute('aria-expanded', 'true')
      
      await buttons.nth(1).click()
      await expect(buttons.first()).toHaveAttribute('aria-expanded', 'false')
      await expect(buttons.nth(1)).toHaveAttribute('aria-expanded', 'true')
    })

    test('clicar el mateix botó el tanca', async ({ page }) => {
      const button = page.locator('button').first()
      
      await button.click()
      await expect(button).toHaveAttribute('aria-expanded', 'true')
      
      await button.click()
      await expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  test.describe('Navegació per teclat', () => {
    test('Tab navega entre botons', async ({ page }) => {
      const buttons = page.locator('button')
      
      await page.keyboard.press('Tab')
      await expect(buttons.first()).toBeFocused()
      
      await page.keyboard.press('Tab')
      await expect(buttons.nth(1)).toBeFocused()
    })

    test('Enter obre/tanca seccions', async ({ page }) => {
      await page.keyboard.press('Tab')
      const button = page.locator('button').first()
      
      await page.keyboard.press('Enter')
      await expect(button).toHaveAttribute('aria-expanded', 'true')
      
      await page.keyboard.press('Enter')
      await expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    test('Space obre/tanca seccions', async ({ page }) => {
      await page.keyboard.press('Tab')
      const button = page.locator('button').first()
      
      await page.keyboard.press('Space')
      await expect(button).toHaveAttribute('aria-expanded', 'true')
    })
  })

  test.describe('Estructura semàntica', () => {
    test('té estructura d\'encapçalaments h3', async ({ page }) => {
      await expect(page.locator('h3')).toHaveCount(3)
      await expect(page.locator('h3 button')).toHaveCount(3)
    })

    test('llista té aria-label', async ({ page }) => {
      const list = page.locator('ul.accordion-controls')
      await expect(list).toHaveAttribute('aria-label', 'Acordeón accesible amb llista')
    })

    test('contingut té aria-labelledby enllaçat al botó', async ({ page }) => {
      const button = page.locator('button').first()
      const content = page.locator('#content-1')
      const buttonId = await button.getAttribute('id')
      
      await expect(content).toHaveAttribute('aria-labelledby', buttonId)
    })
  })
})