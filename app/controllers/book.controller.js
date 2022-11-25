const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const NoteService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "name can not be empty"));
    }

    try {
        const noteService = new NoteService(MongoDB.client);
        const document = await noteService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the note")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let document = [];
    try {
        const noteService = new NoteService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            document = await noteService.findByName(name);
        } else {
            document = await noteService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the notes")
        );
    }

    return res.send(document);
}

exports.findOne = async (req, res, next) => {
    try {
        const noteService = new NoteService(MongoDB.client);
        const document = await noteService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "note not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving note with id=${req.params.id}`)
        )
    }
}

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const noteService = new NoteService(MongoDB.client);
        const document = await noteService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "note not found"));
        }
        return res.send({ message: "note was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating note with id=${req.params.id}`)
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        const noteService = new NoteService(MongoDB.client);
        const document = await noteService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "note not found"));
        }
        return res.send({ message: "note was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete note with id=${req.params.id}`)
        );
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const noteService = new NoteService(MongoDB.client);
        const deletedCount = await noteService.deleteAll();
        return res.send({
            message: `${deletedCount} notes were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all notes")
        );
    }
}

exports.findImportant = async (req, res, next) => {
    try {
        const noteService = new NoteService(MongoDB.client);
        const document = await noteService.findImportant();
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving favorite notes")
        )
    }
}