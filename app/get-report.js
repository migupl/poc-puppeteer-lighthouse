'use strict';

import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';

import { fullConfig } from './config/full.js';

import {
    url,
    output,
    disableDeviceEmulation,
    disableCpuThrottling,
    disableNetworkThrottling,
} from './config/program-params.js';

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
