import { enableProdMode} from '@angular/core';
//import { platformUniversalDynamic } from 'angular2-universal';

import { platformBrowser } from '@angular/platform-browser';

// enable prod for faster renders
enableProdMode();

import { BrowserAppModuleNgFactory } from './app/_platform/app.browser.module.ngfactory';

declare var preboot: any;

enableProdMode();

platformBrowser()
  .bootstrapModuleFactory(BrowserAppModuleNgFactory)
  .then(() => {
    preboot.complete();
  });
