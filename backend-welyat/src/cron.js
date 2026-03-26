const cron = require('node-cron');
const ScoringService = require('./services/ScoringService');
const FoundingService = require('./services/FoundingService');

if (process.env.NODE_ENV !== 'test') {
    cron.schedule('0 0 * * *', ScoringService.checkListeners);
    cron.schedule('0 1 * * *', ScoringService.checkTalkers);
    cron.schedule('0 2 * * *', FoundingService.checkFounding);
}