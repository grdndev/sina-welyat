// Associations
const Boost = require('./Boost');
const BusinessMode = require('./BusinessMode');
const Call = require('./Call');
const CallPaymentIntent = require('./CallPaymentIntent');
const DisclaimerAccepted = require('./DisclaimerAccepted');
const DisclaimerVersion = require('./DisclaimerVersion');
const Emergency = require('./Emergency');
const Rating = require('./Rating');
const Redistribution = require('./Redistribution');
const RedistributionDetail = require('./RedistributionDetail');
const Reputation = require('./Reputation');
const Subscription = require('./Subscription');
const UserSubscription = require('./UserSubscription');
const TechFees = require('./TechFees');
const Transaction = require('./Transaction');
const User = require('./User');

// User <-> Call
User.hasMany(Call, { as: 'calls_as_talker', foreignKey: 'talker_id' });
User.hasMany(Call, { as: 'calls_as_listener', foreignKey: 'listener_id' });
Call.belongsTo(User, { as: 'talker', foreignKey: 'talker_id' });
Call.belongsTo(User, { as: 'listener', foreignKey: 'listener_id' });

// Call <-> CallPaymentIntent (1..n)
Call.hasMany(CallPaymentIntent, { as: 'payment_intents', foreignKey: 'call_id' });
CallPaymentIntent.belongsTo(Call, { foreignKey: 'call_id' });

// User 1.n Boost
User.hasMany(Boost, { foreignKey: 'user_id' });
Boost.belongsTo(User, { foreignKey: 'user_id' });

// Call <-> BusinessMode
BusinessMode.hasMany(Call, { foreignKey: 'business_mode_id' });
Call.belongsTo(BusinessMode, { foreignKey: 'business_mode_id', as: 'business_mode' });

// Disclaimer
DisclaimerVersion.hasMany(DisclaimerAccepted, { foreignKey: 'disclaimer_version_id' });
DisclaimerAccepted.belongsTo(DisclaimerVersion, { foreignKey: 'disclaimer_version_id' });
User.hasMany(DisclaimerAccepted, { foreignKey: 'user_id' });
DisclaimerAccepted.belongsTo(User, { foreignKey: 'user_id' });

// Emergency
User.hasMany(Emergency, { foreignKey: 'user_id' });
Emergency.belongsTo(User, { foreignKey: 'user_id' });
Call.hasMany(Emergency, { foreignKey: 'call_id' });
Emergency.belongsTo(Call, { foreignKey: 'call_id' });

// Rating
Call.hasMany(Rating, { foreignKey: 'call_id' });
Rating.belongsTo(Call, { foreignKey: 'call_id' });
User.hasMany(Rating, { as: 'ratings_given', foreignKey: 'from_user_id' });
User.hasMany(Rating, { as: 'ratings_received', foreignKey: 'to_user_id' });
Rating.belongsTo(User, { as: 'from_user', foreignKey: 'from_user_id' });
Rating.belongsTo(User, { as: 'to_user', foreignKey: 'to_user_id' });

// Reputation
User.hasMany(Reputation, { foreignKey: 'user_id' });
Reputation.belongsTo(User, { foreignKey: 'user_id' });

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

// Subscription
Subscription.hasMany(UserSubscription, { foreignKey: 'subscription_id' });
UserSubscription.belongsTo(Subscription, { foreignKey: 'subscription_id' });
User.hasMany(UserSubscription, { foreignKey: 'user_id' });
UserSubscription.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    Boost,
    BusinessMode,
    Call,
    CallPaymentIntent,
    DisclaimerAccepted,
    DisclaimerVersion,
    Emergency,
    Rating,
    Redistribution,
    RedistributionDetail,
    Reputation,
    Subscription,
    TechFees,
    UserSubscription,
    Transaction,
    User,
};
