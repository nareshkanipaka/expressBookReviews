const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let usersWithSameName = users.filter((user) => {
        return user.username === username
    });
    return usersWithSameName.length > 0;
}

public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(409).json({message: "User already exists!"});
        }
    }
    return res.status(400).json({message: "Missing username or password"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {

try {

const result = await returnBooks ();

 

return res.status(200).json({ data: result });

} catch (error) {

return res.status(500).json({ error: error.message });

}

});

async function returnBooks() { return Object.values(books); }

function searchBookById(id) {

return new Promise((resolve, reject) => {

setTimeout(() => {

const book = books[id];

resolve(book);

}, 1000);

});

}

public_users.get('/isbn/:isbn', function (req, res) {

const bookId = parseInt(req.params.isbn);

 

searchBookById(bookId)

.then(book => {

if (book) {

return res.status(200).json({ book });

} else {

return res.status(404).json({ error: "Book not found" });

}

})

.catch(error => {

return res.status(500).json({ error: error.message });

});

});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const { author } = req.params;
  const booksAsArray = Object.values(books);
  const bookByGivenAuthor = booksAsArray.filter(book => book.author === author);
  return res.status(200).json(bookByGivenAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const { title } = req.params;
    const booksAsArray = Object.values(books);
    const bookByGivenTitle = booksAsArray.filter(book => book.title === title);
    return res.status(200).json(bookByGivenTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn]
    if (book) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({message: "Book not found"});
    }
});

// Delete a book review added by a particular User
public_users.delete('/review/:isbn',function (req, res) {
    const { username } = req.query;
    if (!username) {
        return res.status(400).json({message: "Missing username"});
    }
    const { isbn } = req.params;
    const book = books[isbn]
    if (!book) {
        return res.status(404).json({message: "Book not found"});
    }
    const { reviews } = book;
    const review = reviews[username];
    if (!review) {
        return res.status(404).json({message: "Review not found"});
    } else {
        delete reviews[username];
        return res.status(200).json({message: "Review deleted successfully"});
    }
});


module.exports.general = public_users;
