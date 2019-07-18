const mongoose = require("./db");
const fs = require('fs');
const models = require('./models');

Book = models.Book;
BookGenre=models.BookGenre;

try{
  const booksBuffer=fs.readFileSync('../scraping/books_test.json',"utf8");
  const books = JSON.parse(booksBuffer.toString());
  books.forEach(book=>{
    // console.log(book);
    const bookInstance = new Book({
      title:book.title,
      price:book.price,
      rating:book.rating,
      image:book.image,
      stock:book.stock,
      description:book.description,
      attributes:book.attributes,
      genre:book.genre
    });
    bookInstance.save().then(()=>console.log("saved"));
  })
}catch(e){
  if(e.code==='ENOENT')
    console.log("File not found");
  else throw e;
}

//Genres
/* try {
  const bookGenreBuffer=fs.readFileSync('../scraping/book_genres.json',"utf8");
  const bookGenres = JSON.parse(bookGenreBuffer.toString());
  bookGenres.forEach(genre=>{
    const bookGenre=new BookGenre({name:genre.name})
    bookGenre.save();
  })
} catch (e) {
  if(e.code==='ENOENT')
    console.log("File not found");
  else throw e;
}*/
