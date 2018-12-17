'use strict';

module.exports = {
    fullConfig: {
        extends: 'lighthouse:default',
        settings: {},
        passes: [
            {
                passName: 'extraPass',
                gatherers: [
                    'js-usage',
                ],
            },
        ],
        audits: [
            'byte-efficiency/unused-javascript',
        ],
        categories: {
            'performance': {
                auditRefs: [
                    {id: 'unused-javascript', weight: 0, group: 'load-opportunities'},
                ],
            },
        },
    }
};