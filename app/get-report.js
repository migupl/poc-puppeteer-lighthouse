'use strict';

const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');

const {fullConfig} = require('./config/full');
const {
    url,
    output,
    disableDeviceEmulation,
    disableCpuThrottling,
    disableNetworkThrottling,
} = require('./config/program-params');

(async () => {
    const browser = await puppeteer.launch({
        args: [
            // Required for this docker image of Puppeteer
            '--no-sandbox',
            '--disable-setuid-sandbox',

            // This will write shared memory files into /tmp instead of /dev/shm,
            // Docker’s default for /dev/shm is 64MB
            '--disable-dev-shm-usage',
        ]
    });

    try {
        const page = await browser.newPage();

        await page.goto(url);

        const endpointUrl = new URL(page.browser().wsEndpoint());
        const hostname = endpointUrl.hostname,
            port = endpointUrl.port;

        const lighthouseMetrics =  await lighthouse(
            page.url(), {
                hostname: hostname,
                port: port,
                output: output,
                logLevel: 'error',

                disableDeviceEmulation: disableDeviceEmulation,
                disableCpuThrottling: disableCpuThrottling,
                disableNetworkThrottling: disableNetworkThrottling,
            },
            fullConfig
        ).then(results => {

            delete results.artifacts;
            return results;
        });

        console.log(lighthouseMetrics.report);

    } catch (e) {
        console.error(e);

    } finally {
        await browser.close();
    }
})();
