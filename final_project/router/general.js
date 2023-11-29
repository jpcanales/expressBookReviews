const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
      if (!doesExist(username)) {
          users.push({"username":username,"password":password});
          return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
          return res.status(404).json({message: "User already exists!"});    
        }
      } 
      return res.status(404).json({message: "Unable to register user."});
    });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    AllBooks.then(bookList => res.send(JSON.stringify(bookList)))
  /*res.send(JSON.stringify(books,null,4))
  return res.status(300).json({message: "Books available"});*/
});

let AllBooks = new Promise ((resolve,reject)=> {
    setTimeout(() => {
        resolve((books))}, 1000)});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    let bookByISBN = new Promise ((resolve,reject)=> {
        const isbn = req.params.isbn;
        setTimeout(() => {
            resolve((books[isbn])), 1000}
        )});

    bookByISBN.then(bookList => res.send(JSON.stringify(bookList)))    
    });
  /*res.send(books[isbn]);
  return res.status(300).json({message: "The book with ISBN" + (req.params.isbn) + " is being shown."});
 });*/
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const requestedauthor = req.params.author;
  
  bookByAuthor(requestedauthor)
  .then(matchingBooks => res.send(JSON.stringify(matchingBooks)))
  .catch(error => res.status(500).send(error.message));

   function bookByAuthor(requestedauthor)  {
       return new Promise((resolve,reject) => {
        setTimeout(() => {
            const matchingBooks = [];
            const bookKeys = Object.keys(books);  
            bookKeys.forEach(bookKey => {
                const book = books[bookKey]
                if (book.author.toLowerCase() === requestedauthor.toLocaleLowerCase()) {
                  matchingBooks.push({ bookId: bookKey, ...book });
                }
            });
                resolve(matchingBooks);
            },1000);        
    })
}});

  /*const requestedAuthor = req.params.author;
  const matchingBooks = [];

  // Obtain all the keys for the 'books' object
  const bookKeys = Object.keys(books);

  // Iterate through the 'books' object
  bookKeys.forEach(bookKey => {
    const book = books[bookKey];

    // Check if the author matches the one provided in the request parameters
    if (book.author === requestedAuthor) {
      matchingBooks.push({ bookId: bookKey, ...book });
    }
  });

  if (matchingBooks.length > 0) {
    res.json(matchingBooks);
  } else {
    res.status(404).send('No books found for the provided author.');
}*/

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const requestedTitle = req.params.title;
  
  bookByTitle(requestedTitle)
  .then(matchingBooks => res.send(JSON.stringify(matchingBooks)))
  .catch(error => res.status(500).send(error.message));

   function bookByTitle(requestedTitle)  {
       return new Promise((resolve,reject) => {
        setTimeout(() => {
            const matchingBooks = [];
            const bookKeys = Object.keys(books);  
            bookKeys.forEach(bookKey => {
                const book = books[bookKey]
                if (book.title.toLowerCase() === requestedTitle.toLocaleLowerCase()) {
                  matchingBooks.push({ bookId: bookKey, ...book });
                }
            });
                resolve(matchingBooks);
            },1000);        
    })
}});

  /*const matchingBooks = [];

  // Obtain all the keys for the 'books' object
  const bookKeys = Object.keys(books);

  // Iterate through the 'books' object
  bookKeys.forEach(bookKey => {
    const book = books[bookKey];

    // Check if the author matches the one provided in the request parameters
    if (book.title === requestedTitle) {
      matchingBooks.push({ bookId: bookKey, ...book });
    }
  });

  if (matchingBooks.length > 0) {
    res.json(matchingBooks);
  } else {
    res.status(404).send('No books found for the provided title.');
  }
}); */

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const title = req.params.isbn
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
  return res.status(300).json({message: "Review of " + (books[isbn].title)});
});

module.exports.general = public_users;