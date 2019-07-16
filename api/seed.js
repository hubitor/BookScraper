const mongoose=require('./db');
const Schema = mongoose.Schema;
const Model = mongoose.model;
const BookSchema = new Schema({
  title:{type:String,required:true},
  price:{type:Number,required:true},
  rating:{type:Number,required:false},
  image:{type:String,required:false},
  stock:{type:Number,required:false},
  description:{type:String,required:false},
  attributes:{type:Array,required:false}
});
const Book = Model('Book',BookSchema);
const book=new Book({title:'book',price:20.0});
book.save();
