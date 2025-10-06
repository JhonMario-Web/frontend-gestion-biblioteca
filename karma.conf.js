const { join } = require('node:path');
const { existsSync, readFileSync } = require('node:fs');
const { constants } = require('karma');

if (!process.env.CHROME_BIN) {
  const chromiumPath = '/usr/bin/chromium-browser';
  const useSystemChromium =
    existsSync(chromiumPath) &&
    !readFileSync(chromiumPath, 'utf8').includes('requires the chromium snap');
  process.env.CHROME_BIN = useSystemChromium
    ? chromiumPath
    : require('puppeteer').executablePath();
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        random: false
      },
      clearContext: false
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    coverageReporter: {
      dir: join(__dirname, './coverage/frontend-gestion-biblioteca'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: constants.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadlessCI'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
      }
    },
    singleRun: true,
    restartOnFileChange: false
  });
};