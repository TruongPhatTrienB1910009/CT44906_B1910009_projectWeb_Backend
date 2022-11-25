const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {

    if (!req.body?.email) {
        return next(new ApiError(400, "Email can not be empty"));
    }

    if (!req.body?.password) {
        return next(new ApiError(400, "Password can not be empty"));
    }

    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
}


exports.findUser = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.findUser(req.params.email);
        console.log(req.params.email);
        console.log(document);
        if (!document) {
            return next(new ApiError(404, "Email not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving Email with id=${req.params.email}`)
        )
    }
}