'use strict';

let program = require('commander');
const version = require('../package').version;

program
    .version(version)
    .description('A js script to getting Lighthouse audit reports')
    .arguments('<url>')
    .option('-o, --output [html|json]', 'Output report format', /^(html|json)$/i,'json')
    .option('--disable-device-emulation', 'Disable mobile device emulation', false)
    .option('--disable-cpu-throttling', 'Disable CPU throttling', false)
    .option('--disable-network-throttling', 'Disable Network throttling', false)
    .parse(process.argv);

if (typeof program.args[0] === 'undefined') {
    console.error('Error: No URL given!!\n');
    program.help();
    process.exit(1);
}

module.exports = {
    url: program.args[0],
    output: program.output,

    disableDeviceEmulation: program.disableDeviceEmulation || false,
    disableCpuThrottling: program.disableCpuThrottling || false,
    disableNetworkThrottling: program.disableNetworkThrottling || false,
};
