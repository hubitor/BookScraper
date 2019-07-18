const mongoose = require('mongoose');
// console.log(mongoose);
mongoose.connect('mongodb://localhost:27017/BooksToScrape', {useNewUrlParser: true});
mongoose.connection
        .once('open',()=>console.log('Connection done'))
        .on('error',()=>console.warn('Could not connect to the database'));
module.exports=mongoose;
