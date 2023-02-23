'use strict';

import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';

import { fullConfig } from './config/full.js';

(async () => {
    const browser = await puppeteer.launch({
        args: [
            // Required for this docker image of Puppeteer
            '--no-sandbox',
            '--disable-setuid-sandbox',

            // This will write shared memory files into /tmp instead of /dev/shm,
            // Docker’s default for /dev/shm is 64MB
            '--disable-dev-shm-usage'
        ]
    });

    const page = await browser.newPage();
    await page.goto('https://google.com');

    const url = new URL(page.browser().wsEndpoint());
    const hostname = url.hostname,
        port = url.port;

    const lighthouseMetrics =  await lighthouse(
        page.url(), {
            hostname: hostname,
            port: port,
            output: 'json',
            logLevel: 'error',
        },
        fullConfig
    ).then(results => {

        delete results.artifacts;
        return results;
    });

    console.log(lighthouseMetrics.report);

    await browser.close();
})().catch(console.error);