const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        args: [
            // Required for this docker image of Puppeteer
            '--no-sandbox',
            '--disable-setuid-sandbox',
            // This will write shared memory files into /tmp instead of /dev/shm,
            // because Docker’s default for /dev/shm is 64MB
            '--disable-dev-shm-usage'
        ]
    });

    const page = await browser.newPage();

    await page.goto('https://google.com');
    await page.screenshot({path: 'example.png'});

    await browser.close();
})();