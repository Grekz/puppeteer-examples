import puppeteer from 'puppeteer'
import lighthouse from 'lighthouse'
import devices from 'puppeteer/DeviceDescriptors'
import auditSite from './helpers'
import PuppeteerHar from 'puppeteer-har'
import fs from 'fs'

let browser
let page
const homepage = 'https://www.google.com.mx/'
const iphone = devices['iPhone 6']

describe('Lighhoutse suite', () => {
  it(
    'audits homepage',
    async () => {
      const browser = await puppeteer.launch()

      const results = await auditSite(browser, homepage)
      console.table(results)
      browser.close()
    },
    25000
  )
  it(
    'other lighthouse',
    async () => {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.emulate(iphone)

      const flags = {
        port: new URL(browser.wsEndpoint()).port,
        output: 'html',
      }
      const result = await lighthouse(homepage, flags)
      const html = result.report
      fs.writeFileSync('reports/html/reportfull.html', html)
      await browser.close()
    },
    25000
  )
  it('check code coverage', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.emulate(iphone)

    // Enable both JavaScript and CSS coverage
    await Promise.all([
      page.coverage.startJSCoverage(),
      page.coverage.startCSSCoverage(),
    ])

    await page.goto(homepage)
    // wait for page to render completely
    await page.waitFor('input')

    // Disable both JavaScript and CSS coverage
    const [jsCoverage, cssCoverage] = await Promise.all([
      page.coverage.stopJSCoverage(),
      page.coverage.stopCSSCoverage(),
    ])

    const jsTotalBytes = jsCoverage.reduce(
      (acc, val) => acc + val.text.length,
      0
    )
    const cssTotalBytes = cssCoverage.reduce(
      (acc, val) => acc + val.text.length,
      0
    )
    const jsUsedBytes = jsCoverage.reduce(
      (acc, val) =>
        acc +
        val.ranges.reduce((racc, rval) => racc + rval.end - rval.start - 1, 0),
      0
    )
    const cssUsedBytes = cssCoverage.reduce(
      (acc, val) =>
        acc +
        val.ranges.reduce((racc, rval) => racc + rval.end - rval.start - 1, 0),
      0
    )
    console.log(
      `Used js bytes: ${Math.floor((jsUsedBytes / jsTotalBytes) * 100)}%`
    )
    console.log(
      `Used css bytes: ${Math.floor((cssUsedBytes / cssTotalBytes) * 100)}%`
    )

    await browser.close()
  })
})
describe('Some tests', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch()
    page = await browser.newPage()
    await page.emulate(iphone)
  })
  afterAll(async () => {
    browser.close()
  })
  it('one test', () => {
    expect(1).toBe(1)
  })
  it('should create a browser', async () => {
    expect(browser).not.toBeNull()
  })
  it('should create a page', async () => {
    expect(page).not.toBeNull()
  })
  it(
    'navigate to betreut page',
    async () => {
      const har = new PuppeteerHar(page)
      await har.start({ path: 'reports/har/results.har' })
      await page.goto(homepage)
      expect(page.url()).toBe(homepage)
      await har.stop()
    },
    10000
  )
})
