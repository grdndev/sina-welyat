const cron = require('node-cron');
const ScoringService = require('./services/ScoringService');

cron.schedule('0 0 * * *', ScoringService.checkTalker);