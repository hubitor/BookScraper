const puppeteer = require('puppeteer');
const fs = require('fs');
const chalk = require('chalk');

console.time("books scraping");
let scrapeProcess = async()=>{
  console.log(chalk.white("Scraping begins.."));
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();

  await page.goto('http://books.toscrape.com/')

  page.on('console', msg => {
    console.log(msg.args());
  });

  const {numPages,booksPerPage} = await page.evaluate(
    ()=>{
      re=/of\s(.*)/;
      current = document.querySelector(".current").innerText;
      numPages=parseInt(re.exec(current)[1],10);
      formText=document.querySelector(".form-horizontal").innerText;
      reText=/(\d*)\./;
      booksPerPage=parseInt(reText.exec(formText)[1],10);
      return {numPages,booksPerPage};
    }
  )
  console.log(chalk.white(`Number of pages is: ${numPages}`));
  console.log(chalk.white(`Books per page is: ${booksPerPage}`));
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
    for(j=0;j<booksPerPage;j++){
      await page.click(`#default > div.container-fluid.page > div > div > div > section > div:nth-child(2) > ol > li:nth-child(${j+1}) > article > div.image_container > a > img`);
      await page.waitFor(1000);
      bookInfo=await page.evaluate(
        ()=>{
          re=/\((\d*)/;
          stockElem=document.querySelector("#content_inner > article > div.row > div.col-sm-6.product_main > p.instock.availability");
          stock=stockElem?parseInt(re.exec(stockElem.innerText)[1],10):null;
          description=document.querySelector("#content_inner > article > p")?document.querySelector("#content_inner > article > p").innerText:null;
          attributes=[];
          attributeList=(document.querySelector(".table-striped")).querySelectorAll("tr");
          attributeList.forEach(attribute=>{
            attributes.push({attribute:attribute.querySelector("th").innerText,
              value:attribute.querySelector("td").innerText})
          })
          return {stock,description,attributes};
        }
      )
      result[j].stock=bookInfo.stock;
      result[j].description=bookInfo.description;
      result[j].attributes=bookInfo.attributes;
      await page.goBack();
      // await page.waitFor(1000);
    }
    results.push(result);
    console.log(chalk.yellow(`Page ${i+1} completed`))
    if(i<numPages-1)
      await page.click('#default > div.container-fluid.page > div > div > div > section > div:nth-child(2) > div > ul > li.next > a');
  }
  console.log(chalk.green("Scraping completed"));
  browser.close();
  return results;
}
scrapeProcess().then(data=>{
  fs.writeFile('books.json',JSON.stringify(data),(err)=>{
    console.timeEnd("books scraping");
    if(err) {
      console.log(chalk.red('Error on writing file'));
      throw err;
    }
    console.log(chalk.green('File written successfully'))

  });
});
