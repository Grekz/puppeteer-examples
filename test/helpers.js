import lighthouse from 'lighthouse'

const auditSite = async (browser, auditUrl) => {
  let lhr = await lighthouse(auditUrl, {
    port: new URL(browser.wsEndpoint()).port,
    output: 'json',
    logLevel: 'info',
  })
  const jsonProperty = new Map()
    .set('accessibility', (await lhr.lhr.categories.accessibility.score) * 100)
    .set('performance', (await lhr.lhr.categories.performance.score) * 100)
    .set('progressiveWebApp', (await lhr.lhr.categories.pwa.score) * 100)
    .set(
      'bestPractices',
      (await lhr.lhr.categories['best-practices'].score) * 100
    )
    .set('seo', (await lhr.lhr.categories.seo.score) * 100)
    .set('pageSpeed', (await lhr.lhr.audits['speed-index'].score) * 100)
    .set(
      'contrast',
      (await lhr.lhr.audits['color-contrast'].score) !== 0 ? 'Pass' : 'Fail'
    )
    .set(
      'vulnerabilities',
      (await lhr.lhr.audits['no-vulnerable-libraries'].score) !== 0
        ? 'Pass'
        : 'Fail'
    )
    .set(
      'altText',
      (await lhr.lhr.audits['image-alt'].score) !== 0 ? 'Pass' : 'Fail'
    )
    // .set(
    //   'pageSpeed',
    //   (await lhr.lhr.audits['speed-index'].score) !== 0 ? 'Pass' : 'Fail'
    // )
    .set(
      'ariaAttributeValuesCorrect',
      (await lhr.lhr.audits['aria-valid-attr-value'].score) !== 0
        ? 'Pass'
        : 'Fail'
    )
    .set(
      'ariaAttributesCorrect',
      (await lhr.lhr.audits['aria-valid-attr'].score) !== 0 ? 'Pass' : 'Fail'
    )
    .set(
      'duplicateId',
      (await lhr.lhr.audits['duplicate-id'].score) !== 0 ? 'Pass' : 'Fail'
    )
    .set(
      'tabIndex',
      (await lhr.lhr.audits['tabindex'].score) !== 0 ? 'Pass' : 'Fail'
    )
    .set(
      'logicalTabOrder',
      (await lhr.lhr.audits['logical-tab-order'].score) !== 0 ? 'Pass' : 'Fail'
    )

  return await jsonProperty
}
export default auditSite
