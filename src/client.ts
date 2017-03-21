// the polyfills must be the first thing imported
//import 'angular2-universal-polyfills';

// Angular 2
import { enableProdMode} from '@angular/core';
//import { platformUniversalDynamic } from 'angular2-universal';

import { platformBrowser } from '@angular/platform-browser';

// enable prod for faster renders
enableProdMode();

import { MainModule } from './main.browser';

//const platformRef = platformUniversalDynamic();

// on document ready bootstrap Angular 2
/*document.addEventListener('DOMContentLoaded', () => {

  platformRef.bootstrapModule(MainModule);

});*/

declare var preboot: any;

enableProdMode();

platformBrowser()
  .bootstrapModule(MainModule)
  .then(() => {
    preboot.complete();
  });