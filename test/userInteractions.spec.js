import puppeteer from 'puppeteer'
import devices from 'puppeteer/DeviceDescriptors'
import auditSite from './helpers'

const iphone6 = devices['iPhone 6']
const HomePage = 'https://www.betreut.de/'

let page
let browser
const secondsToWait = 20
const testTimeout = 1000 * secondsToWait

describe('Performance testing - homepage', () => {
  it(
    'check lighthouse report',
    async () => {
      browser = await puppeteer.launch({
        headless: true,
      })
      page = await browser.newPage()
      const results = await auditSite(browser, HomePage)
      browser.close()
      console.table(results)
    },
    testTimeout
  )
})
describe('E2E testing - homepage ', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 100,
    })
    page = await browser.newPage()
    await page.emulate(iphone6)
  })

  afterAll(() => {
    browser.close()
  })
  it(
    'can be accessed with screenshot/pdf',
    async () => {
      await page.goto(HomePage)
      await page.screenshot({ path: 'screenshots/homepage.png' })
      // to create PDF needs to be headless=true
      // await page.pdf({ path: 'pdf_reports/homepage.pdf', format: 'A4' })
      expect(page.url()).toBe(HomePage)
    },
    testTimeout
  )
  it(
    'has the proper title text',
    async () => {
      await page.goto(HomePage)
      const title = await page.title()
      await expect(title).toMatch(
        'Betreuung, Haushaltshilfe, Tiersitter & mehr - Betreut.de'
      )
    },
    testTimeout
  )
  it(
    'a footer exists',
    async () => {
      await page.goto(HomePage)
      // quick way to check if element exists =)
      const footerExists = !!(await page.$('footer'))
      expect(footerExists).toBeTruthy()
    },
    testTimeout
  )
  it(
    'can start enrollment by clicking header register',
    async () => {
      // goes to HomePage and it waits until there are no more than 2 network connections
      await page.goto(HomePage, { waitUntil: 'networkidle2' })

      // open dropdown
      await page.click('[for="enroll-dropdown"]')

      // first we click the register btn
      // we wait until the navigation to the next page has finished
      await Promise.all([
        page.click('.enroll-popover-sign-up-link'),
        page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      ])

      // expecte the current page is now /join-now
      await expect(page.url()).toContain('/join-now')
    },
    testTimeout
  )
})
