const puppeteer = require('puppeteer');
const fs = require('fs');
const chalk = require('chalk');

let scrapeProcess = async()=>{
  console.log(chalk.white("Scraping begins.."));
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();

  await page.goto('http://books.toscrape.com/')

  /* page.on('console', msg => {
    console.log(msg.args());
  });*/

  const numPages = await page.evaluate(
    ()=>{
      re=/of\s(.*)/;
      current = document.querySelector(".current").innerText;
      numPages=parseInt(re.exec(current)[1],10);
      return numPages;
    }
  )
  console.log(chalk.white(`Number of pages is: ${numPages}`));
  results=[];
  for(let i =0;i<numPages;i++){
    let result=[];
    result = await page.evaluate(()=> {
      data=[];
      let elements=document.querySelectorAll(".product_pod");
      for(let element of elements){
        let rating = element.childNodes[3].className.split(" ")[1];
        switch(rating){
          case 'One':
            rating=1;
            break;
          case 'Two':
            rating=2;
            break;
          case 'Three':
            rating= 3;
            break;
          case 'Four':
            rating=4;
            break;
          default:
            rating=5;
            break;
        }
        let title = element.childNodes[5].childNodes[0].attributes[1].value;
        let price = element.childNodes[7].children[0].innerText; // Select the price
        data.push({title, price,rating}); // Push an object with the data onto our array
      }
      return data;
    });
    results.push(result);
    if(i<numPages-1)
      await page.click('#default > div.container-fluid.page > div > div > div > section > div:nth-child(2) > div > ul > li.next > a');
  }
  console.log(chalk.green("Scraping completed"));
  // console.log(result);
  // await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img');

  browser.close();
  return results;
}
scrapeProcess().then(data=>{
  fs.writeFile('products.json',JSON.stringify(data),(err)=>{
    if(err) {
      console.log(chalk.red('Error on writing file'));
      throw err;
    }
    console.log(chalk.green('File written successfully'))
  });
});
