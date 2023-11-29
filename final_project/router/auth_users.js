const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const reviewText = req.query.review;

  if (!isbn || !reviewText) {
    return res.status(400).send('ISBN and review are required.');
  }

  const username = req.session.authorization.username;

  // Check if the book exists
  if (books[isbn]) {
    // Check if the user already has a review for this book
    if (books[isbn].reviews[username]) {
      // Modify the existing review
      books[isbn].reviews[username] = reviewText;
      res.send('Review added or modified successfully.');
    }
  } else {
    res.status(404).send('Book not found.');
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

  if (!isbn) {
    return res.status(400).send('ISBN is required.');
  }

  const username = req.body.username;

  // Check if the book exists
  if (books[isbn]) {
    // Check if the user has a review for this book
    if (books[isbn].reviews[username]) {
      // Delete the user's review for this book
      delete books[isbn].reviews[username];
      res.send('Review deleted successfully.');
    } else {
      res.status(404).send('User has no existing review for this book.');
    }
  } else {
    res.status(404).send('Book not found.');
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;