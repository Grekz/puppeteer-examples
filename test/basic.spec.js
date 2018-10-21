import puppeteer from 'puppeteer'

const someUrl = 'https://www.google.com.mx/'
let browser
let page

describe('Some tests', () => {
  beforeAll(async () => {
    // Interacts with browser
    browser = await puppeteer.launch({ headless: true, slowMo: 10 })

    // Interacts with the page
    page = await browser.newPage()
  })

  afterAll(async () => {
    browser.close()
  })
  it('passes', async () => {
    await expect(1).toBe(1)
  })
  it('open a headless browser', async () => {
    await expect(browser).not.toBeNull()
  })
  it('open a page in a headful browser', async () => {
    await expect(page).not.toBeNull()
  })
  it(
    'open a page in a headful browser, but slowly pls!',
    async () => {
      await page.goto(someUrl)
      await expect(page.url()).toBe(someUrl)
    },
    25000
  )
})
