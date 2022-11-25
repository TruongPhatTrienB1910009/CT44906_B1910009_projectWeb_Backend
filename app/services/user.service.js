const { ObjectId } = require('mongodb');
const { email } = require('mongodb');

class userService {
    constructor(client) {
        this.User = client.db().collection('users');
    }

    extractUserData(payload) {
        const user = {
            email: payload.email,
            password: payload.password
        };

        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        return user;
    }
    async create(payload) {
        const user = this.extractUserData(payload);
        const result = await this.User.findOneAndUpdate(
            user,
            { $set: {} },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async findUser(emailuser) {
        return await this.User.findOne({
            email: emailuser
        });
    }
}

module.exports = userService;