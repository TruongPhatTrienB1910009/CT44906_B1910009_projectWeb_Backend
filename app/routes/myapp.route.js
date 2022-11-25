const express = require('express');
const user = require('../controllers/user.controller');
const book = require('../controllers/book.controller');

const router = express.Router();

router.route("/books")
    .get(book.findAll)
    .post(book.create)
    .delete(book.deleteAll);

router.route("/books/important")
    .get(book.findImportant);

router.route("/books/:id")
    .get(book.findOne)
    .put(book.update)
    .delete(book.delete);

router.route("/")
    .post(user.create)

router.route("/:email")
    .get(user.findUser)

module.exports = router;