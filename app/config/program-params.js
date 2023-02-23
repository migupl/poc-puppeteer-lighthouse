'use strict';

import program from 'commander';
import version from '../package.json' assert { type: 'json' };

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

const url = program.args[0];
const output = program.output;
const disableDeviceEmulation = program.disableDeviceEmulation || false;
const disableCpuThrottling = program.disableCpuThrottling || false;
const disableNetworkThrottling = program.disableNetworkThrottling || false;

export {
    url,
    output,

    disableDeviceEmulation,
    disableCpuThrottling,
    disableNetworkThrottling,
};
