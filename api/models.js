const mongoose = require("./db");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const BookSchema = new Schema({
  title: { type: String, required: true },
  genre: { type:String, require:true},
  price: { type: String, required: true },
  rating: { type: Number, required: false },
  image: { type: String, required: false },
  stock: { type: Number, required: false },
  description: { type: String, required: false },
  attributes: { type: Array, required: false }
});
const BookGenreSchema = new Schema({
  name:{type:String, required:true}
});
const Book = Model("Book", BookSchema);
const BookGenre = Model("BookGenre",BookGenreSchema);

module.exports={
  Book,
  BookGenre
}
