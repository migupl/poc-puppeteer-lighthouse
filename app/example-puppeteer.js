'use strict';

import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
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

    // wait until page is loaded
    await page.goto('https://google.com', { waitUntil: 'networkidle0' });

    await page.screenshot({path: 'example.png'});

    await browser.close();
})();