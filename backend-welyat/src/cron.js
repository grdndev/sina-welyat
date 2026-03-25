const cron = require('node-cron');
const ScoringService = require('./services/ScoringService');

if (process.env.NODE_ENV !== 'test')
cron.schedule('0 0 * * *', ScoringService.checkTalker);