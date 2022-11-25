const { ObjectId } = require('mongodb');

class noteService {
    constructor(client) {
        this.Note = client.db().collection('books');
    }

    extractNoteData(payload) {
        const note = {
            linkImage: payload.linkImage,
            linkBook: payload.linkBook,
            author: payload.author,
            name: payload.name,
            content: payload.content,
            important: payload.important,
        };

        Object.keys(note).forEach(
            (key) => note[key] === undefined && delete note[key]
        );
        return note;
    }
    async create(payload) {
        const note = this.extractNoteData(payload);
        const result = await this.Note.findOneAndUpdate(
            note,
            { $set: { important: note.important === true } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }



    async find(filter) {
        const cursor = await this.Note.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.Note.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractNoteData(payload);
        const result = await this.Note.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }


    async delete(id) {
        const result = await this.Note.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async findImportant() {
        return await this.find({ important: true });
    }

    async deleteAll() {
        const result = await this.Note.deleteMany({});
        return result.deletedCount;
    }

}

module.exports = noteService;