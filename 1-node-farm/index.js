const fs = require('fs');
const http = require('http');
const url = require('url');

///////////////////////////
// File

// // Blocking, syncronous way
// const txtIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(txtIn);

// const txtOut = `This is what know about apple: ${txtIn}. \nCreated on ${Date.now()}`;
// fs.writeFileSync('./starter/txt/output.txt', txtOut);
// console.log('File written');

// Non-blocking async
// fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data1) => {
//     if(err) {
//         return console.log('!error😄');
//     }
//     fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./starter/txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./starter/txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('File written 😍');
//             });
//         });
//     })    
// });

// console.log('Will read file');

///////////////////////////////////
// Server
const replaceTemp = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);

    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FORM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }

    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/final/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/final/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/final/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const pathName = req.url;
    // Overview page
    if(pathName == '/overview' || pathName == '/'){
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHtml = dataObj.map(obj => replaceTemp(tempCard, obj)).join('');
        console.log(cardsHtml);

        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output);
    
    // Product page
    } else if(pathName == '/product') {
        res.end('This is the product');

    //API
    } else if (pathName == '/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);
    
    //NOT FOUND
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'Hello-World'
        });
        res.end('<h1>This page cannot be found!</h1>')
    }
        
});

server.listen(8081, '127.0.0.1', () => {
    console.log('Listening on port 8081')
});