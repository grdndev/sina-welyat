// Associations
const User = require('./User');
const BusinessMode = require('./BusinessMode');
const Call = require('./Call');
const Rating = require('./Rating');
const Transaction = require('./Transaction');
const Redistribution = require('./Redistribution');
const RedistributionDetail = require('./RedistributionDetail');

// User <-> Call
User.hasMany(Call, { as: 'calls_as_parlant', foreignKey: 'parlant_id' });
User.hasMany(Call, { as: 'calls_as_ecoutant', foreignKey: 'écoutant_id' });
Call.belongsTo(User, { as: 'parlant', foreignKey: 'parlant_id' });
Call.belongsTo(User, { as: 'écoutant', foreignKey: 'écoutant_id' });

// Call <-> BusinessMode
BusinessMode.hasMany(Call, { foreignKey: 'business_mode_id' });
Call.belongsTo(BusinessMode, { foreignKey: 'business_mode_id' });

// Rating
Call.hasMany(Rating, { foreignKey: 'call_id' });
Rating.belongsTo(Call, { foreignKey: 'call_id' });
User.hasMany(Rating, { as: 'ratings_given', foreignKey: 'from_user_id' });
User.hasMany(Rating, { as: 'ratings_received', foreignKey: 'to_user_id' });
Rating.belongsTo(User, { as: 'from_user', foreignKey: 'from_user_id' });
Rating.belongsTo(User, { as: 'to_user', foreignKey: 'to_user_id' });

// Transaction
User.hasMany(Transaction, { foreignKey: 'user_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });
Call.hasMany(Transaction, { foreignKey: 'call_id' });
Transaction.belongsTo(Call, { foreignKey: 'call_id' });

// XP Redistribution
User.hasMany(Redistribution, { foreignKey: 'executed_by_admin_id' });
Redistribution.belongsTo(User, { foreignKey: 'executed_by_admin_id' });
Redistribution.hasMany(RedistributionDetail, { foreignKey: 'redistribution_id' });
RedistributionDetail.belongsTo(Redistribution, { foreignKey: 'redistribution_id' });
User.hasMany(RedistributionDetail, { foreignKey: 'user_id' });
RedistributionDetail.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    User,
    BusinessMode,
    Call,
    Rating,
    Transaction,
    Redistribution,
    RedistributionDetail
};
