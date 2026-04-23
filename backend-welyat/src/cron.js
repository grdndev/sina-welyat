const cron = require('node-cron');
const ScoringService = require('./services/ScoringService');
const FoundingService = require('./services/FoundingService');
const MailService = require('./services/MailService');

if (process.env.NODE_ENV !== 'test') {
    cron.schedule('0 0 * * *', ScoringService.checkListeners);
    cron.schedule('0 1 * * *', ScoringService.checkTalkers);
    cron.schedule('0 2 * * *', FoundingService.checkFounding);
    
    // Relances à 1h et 24h
    cron.schedule('0 * * * *', MailService.sendHourlyReminders);
}