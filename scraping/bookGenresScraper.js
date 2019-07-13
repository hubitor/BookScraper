const puppeteer = require('puppeteer');
const fs = require('fs');
const chalk = require('chalk');

//time performance
console.time("genres scraping")

let scrapeProcess = async()=>{
  console.log(chalk.white("Scraping begins.."));
  const browser = await puppeteer.launch({headless:false}); //true if we want to do it in the background
  const page = await browser.newPage();
  page.on('console', msg => {
    console.log(msg.args());
  });
  await page.goto('http://books.toscrape.com/')
  genres=await page.evaluate(()=>{
    //Create the script dynamically
    //script = document.createElement('script');
    // script.setAttribute('src','./utils.js');
    // rating = getRating("Three");
    books_navigator = document.querySelector("#default > div.container-fluid.page > div > div > aside > div.side_categories > ul > li > ul");
    genresList = books_navigator.querySelectorAll("li");
    genres=[];
    genresList.forEach(genreElm=>{
      genres.push({name:genreElm.innerText});
    })
    return genres;
  });
  console.log(chalk.green('Scraping completed'));
  browser.close();
  return genres;
}

scrapeProcess().then((genres)=>{
  fs.writeFile('book_genres.json',JSON.stringify(genres),(err)=>{
    if(err) {
      console.log(chalk.red('Error on writing file'));
      throw err;
    }
    console.log(chalk.green('File written successfully'));
    console.timeEnd('genres scraping');
  })
})
