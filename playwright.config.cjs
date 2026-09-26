const { devices } = require('@playwright/test')

/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  timeout: 30 * 1000,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 }
  },
  testDir: 'e2e',
  webServer: {
    command: '"C:\\Program Files\\nodejs\\npm.cmd" run build && "C:\\Program Files\\nodejs\\npm.cmd" run preview',
    port: 4173,
    reuseExistingServer: true,
    timeout: 120000
  }
}
