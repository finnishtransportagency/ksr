const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy('/api', {
        'target': 'http://localhost:8080',
        'testURL': 'http://localhost/',
        'headers': {
          'OAM_REMOTE_USER': 'dev_user',
          'OAM_GROUPS': 'KSR_ROLE_ADMIN',
        }
    }))
}
