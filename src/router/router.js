const url = require('url');
const fs = require('fs');
const path = require('path');
const AlphaVantageAPI = require('alpha-vantage-cli').AlphaVantageAPI;
const https = require('https');
const redis = require('redis');

// Un router muy basico que responde a las peticiones principales
const handleRequest = (request, response) => {
      console.log('Se requiere', request.url);
      let path = url.parse(request.url).pathname;

      switch (path) {
          case '/':
              render('../../build/index.html', response);
              break;
          case '/build/bundle.js':
              render('../../build/bundle.js', response);
              break;
          case '/css/bitcoin.css':
              render('../../build/css/bitcoin.css', response);
              break;
          case '/api/BTC/mes':
              get('BTC', 'mes', response );
              break;
          case '/api/BTC/hora':
              get('BTC', 'hora', response );
              break;
          case '/api/ETH/mes':
              get('ETH', 'mes', response );
              break;
          case '/api/ETH/hora':
              get('ETH', 'hora', response );
              break;
          default:
              response.writeHead(404);
              response.write('Route not defined');
              response.end();
      }
}

module.exports = handleRequest;


//1ro chequiamos que existan los datos consultados en la DB
//si no existen, los vamos a consultar a la API
const get = (currency, filtro, response) => {

const client = redis.createClient();

    let query = `${( (currency == 'BTC') ? 'btc_' : 'eth_')}${( (filtro == 'mes') ? 'mes' : 'hora')}`;
    let DIGITAL_CURRENCY_FILTRO = `${( (filtro == 'mes') ? 'DIGITAL_CURRENCY_MONTHLY' : 'DIGITAL_CURRENCY_INTRADAY')}`;

    client.smembers( query, (err, data) => {

      if (data.length > 0) {

        response.writeHead(200, {"Content-Type":"application/json"});
        response.end(JSON.stringify(data));
      } else {

        consultarApi(
              DIGITAL_CURRENCY_FILTRO, 
              currency,
              query,
              client, 
              response);
      }

    });

}


//Consultamos la API, en caso de algun error se repite la consulta
const consultarApi = (time, currency, query, client, response) => {

https.get(
    `https://www.alphavantage.co/query?function=${time}&symbol=${currency}&market=CLP&apikey=QZAYVY2Y7GVZSY20`
, (res) => {
    let json = '';
    res.on('data', (chunk) => {
        json += chunk;
    });
    res.on('end',  () => {
      try {
        if (Math.random(0, 1) < 0.1) {
          throw new Error('How unfortunate! The API Request Failed');
        } 
        ordenar(JSON.parse(json), query, client, response);
      }
      catch (err) {
              console.log(err)
        consultarApi(time, currency, query, client, response);
      }


    });
}).on('error', (err) => {
      console.log('Error:', err);
});

}

//Filtramos y ordenamos un poco los datos para ser consumidos por el Frontend
const ordenar = (json, query, client, response) => {

  let list = [];
  let time_series;
  let cont = 0;
  let ttl = 0;

  if (query.includes('mes')) {
    time_series = 'Time Series (Digital Currency Monthly)';
    ttl = 86400;

    for (let i in json[time_series]) {

    client.sadd( query, `${i}:${Math.round(json[time_series][i]['2a. high (CLP)'])}`);
    list[cont] = `${i}:${Math.round(json[time_series][i]['2a. high (CLP)'])}`;
      
      cont++;
      if (cont == 12)
        break;
    }

  } else if (query.includes('hora')) {
    time_series = 'Time Series (Digital Currency Intraday)';
    ttl = 3600;
    let cont12 = 0;
    let cont1h = 0;
    let cont24 = 0;

    for (let i in json['Time Series (Digital Currency Intraday)']) {
      if ((cont12 % 12) == 0) { 
        client.sadd( query, `${i.substring(11)}/${Math.round(json['Time Series (Digital Currency Intraday)'][i]['1a. price (CLP)'])}`);
        list[cont] = `${i.substring(11)}/${Math.round(json['Time Series (Digital Currency Intraday)'][i]['1a. price (CLP)'])}`;
        cont++;
        cont24++;
      }
      cont12++;
      if (cont24 == 24)
        break;
    }

  }

  client.expire(query, ttl)
  response.writeHead(200, {"Content-Type":"application/json"});
  response.end(JSON.stringify(list));

}


function renderHTML(path, response) {
    fs.readFile(path, null, function(error, data) {
        if (error) {
            response.writeHead(404);
            response.write('File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
}


const render = (file, response) => {

    const filePath = path.resolve(__dirname, file);
					
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

	fs.readFile(filePath, (err, content) => {

		response.writeHead(200, { 'Content-Type': contentType })		
    response.end(content, 'utf-8');
	});

}



