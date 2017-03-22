import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {Http, XHRBackend, RequestOptions} from "@angular/http";
let Cookies = require( "cookies" );
// the polyfills must be the first thing imported in node.js
//import 'angular2-universal-polyfills';

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import { enableProdMode } from '@angular/core';
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

// Angular 2 Universal
//import { createEngine } from 'angular2-express-engine';

import { ServerAppModuleNgFactory  } from './app/_platform/app.server.module.ngfactory';
import * as api from './backend/api';
import { Tools } from './backend/tools';
import { App } from './app/app';
import {Router} from "@angular/router";
import {HttpInterceptor} from "./app/shared/http.service";
import { ngExpressEngine } from './modules/ng-express-engine/express-engine'

declare var Zone: any;
// enable prod for faster renders
enableProdMode();

const app = express();
const ROOT = path.join(path.resolve(__dirname, '..'));

// APP_PORT, APP_ENV, APP_SSL
const env = process.env.NODE_ENV || process.env.APP_ENV, port = (parseInt(process.env.APP_PORT, 10) || 9002), ssl = (parseInt(process.env.APP_SSL, 10) || 0);

// Express View
/*app.engine('.html', createEngine({
  ngModule: MainModule,
}));*/
app.engine('html', ngExpressEngine({
  aot: true,
  bootstrap: ServerAppModuleNgFactory
}));

app.set('views', __dirname);
app.set('view engine', 'html');

//noinspection TypeScriptValidateTypes
//app.use(cookieParser('Angular 2 Universal'));
app.use(cookieParser());
app.use(bodyParser.json());

// language version - !!! MUST BE BEFORE ANY DB CALL !!!
app.use(Tools.countryVersion);

// cookies
app.use(Cookies.express());
app.use(api.sessionidCookie);

// var app = express()
app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets'), {maxAge: 0}));
app.use('/tools', express.static(path.join(__dirname, '../tools'), {maxAge: 0}));
app.use('/templates', express.static(path.join(__dirname, '../templates'), {maxAge: 0}));
app.use('/images', express.static(path.join(__dirname, '../images'), {maxAge: 0}));
app.use('/examples', express.static(path.join(__dirname, '../examples'), {maxAge: 0}));
app.use('/files', express.static(path.join(__dirname, '../files'), {maxAge: 0}));
app.use('/etim', express.static(path.join(__dirname, '../'), {maxAge: 0}));
app.use(express.static(path.join(ROOT, 'dist/client'), {index: false}));

/*
function ngApp(req, res) {
  res.render('index', {
    req,
    res,
    ngModule: MainModule,
    preboot: false, //{ appRoot: ['app'], uglify: true },
    baseUrl: '/',
    requestUrl: req.originalUrl,
    originUrl: req.hostname,
    //time: true
  });
}
*/

function ngApp(req, res) {

  function onHandleError(parentZoneDelegate, currentZone, targetZone, error)  {
    console.warn('Error in SSR, serving for direct CSR');
    res.sendFile('index.html', { root: './src' });
    return false;
  }

  Zone.current.fork({ name: 'CSR fallback', onHandleError }).run(() => {
    console.time(`GET: ${req.originalUrl}`);
    res.render('index', {
      req: req,
      res: res
    });
    console.timeEnd(`GET: ${req.originalUrl}`);
  });

}


// Routes with html5pushstate
// ensure routes match client-side-app
/*app.get('/', ngApp);
app.get('/about', ngApp);
app.get('/about/!*', ngApp);
app.get('/home', ngApp);
app.get('/home/!*', ngApp);*/

app.get('/meta', api.metaTags);
app.get('/language', api.language);
app.get('/tryCatch.js.map', function (req, res, next) {res.send('');});
app.get('/web_get_img_data', api.emptyImage);
app.get('/logout', api.logout);
app.post('/login', api.login);
app.get('/xml-export-seznam', api.xmlExportSeznam);
app.get('/xml-export-heureka', api.xmlExportHeureka);
app.get('/sitemap', api.sitemap);
app.get('/partners', api.partnersList);
app.get('/user', api.user);
app.post('/user', api.createUser);
app.put('/user', api.saveUser);
app.post('/user/current', api.saveCurrentUser);
app.get('/user/countries', api.userCountries);

app.get('/cart', api.cart);
app.get('/shipping', api.shipping);
app.get('/shipping/:code', api.shipping);
app.post('/shipping', api.shippingPost);
app.get('/payment', api.payment);
app.get('/payment/:code', api.payment);
app.post('/payment', api.paymentPost);
app.post('/order', api.createOrder);
app.get('/order/verify', api.verifyOrder);
app.post('/coupons', api.addCoupon);
app.delete('/coupons/:code', api.removeCoupon);

app.get('/load-objects/redirect/tryCatch.js.map', function (req, res, next) {next();});
app.get('/load-objects/redirect/:code', api.loadObjects);
app.get('/redirect-navigations/page/:id', api.redirectNavigations);
app.get('/redirect-navigations/product/:code', api.redirectNavigationsProduct);

app.get('/products/:code', api.getProduct);
app.get('/products/:code/configurator/:type', api.getProduct);
app.post('/products/buy', api.productBuy);
app.post('/products/:id/buy', api.productBuy);
app.put('/products', api.productPut);
app.delete('/products/item/:itemId', api.productDelete);
app.get('/products/list/:code', api.productsList);
app.get('/products/list/:code/pagination', api.productsListPagination);
app.get('/products/:id/attachments/type/:type/table/:tableName', api.attachments);
app.get('/products/:id/similar', api.productsSimilar);
app.get('/products/:id/childs', api.productsChilds);
app.get('/products/:id/accessories', api.productsAccessories);

app.get('/filter/:code/type/:type', api.getFilterForList);
app.get('/filter/type/:code', api.getFilterType);
app.get('/cats/:code', api.category);
app.get('/attachments/:id', api.attachment);
app.get('/files/**', api.emptyImage);
app.post('/newsletter/login', api.newsletterLogin);

app.get('/search', api.productsList);
app.get('/search/pagination', api.productsListPagination);
app.get('/search-api/:searchStr', api.search);

app.post('/configurator/cart', api.addToCartFromConfigurator);
app.get('/products/:id/product-list', api.productDataList);
app.get('/products/:id/product-list/pdf', api.productDataListPdf);

app.post('/assist/message', api.assistMessage);
app.post('/lost-password', api.lostPassword);

app.get('/:code', ngApp);
app.get('/:code/search/:searchStr', ngApp);
app.get('/:code/konfigurator/:redirect', ngApp);
app.get('/:code/konfigurator2/:redirect', ngApp);
app.get('/', ngApp);

app.get('*', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var pojo = { status: 404, message: 'No Content' };
  var json = JSON.stringify(pojo, null, 2);
  res.status(404).send(json);
});

// Server
let server = app.listen(port, () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});
