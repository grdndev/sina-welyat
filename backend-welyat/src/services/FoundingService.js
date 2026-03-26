const { Op } = require("sequelize");
const { User } = require("../models");

class FoundingService {
    async checkFounding() {
        await User.update({
            where: {
                is_founding: true,
                founding_end_date: {[Op.lte]: new Date()}
            },
            is_founding: false
        });
    }
}

module.exports = new FoundingService();
