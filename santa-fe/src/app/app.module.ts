import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { environment } from '../environments/environment';

import { StoreModule } from '@ngrx/store';
import { appReducers, metaReducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from 'Core/core.module';
import { HomeModule } from './modules/home/home.module';
import { MarketModule } from 'Market/market.module';
import { TradeModule } from 'Trade/trade.module';
import { StructureModule } from 'Structure/structure.module';
import { AgGridModule } from 'ag-grid-angular';

import { AppRoot } from './app.root';

import { SantaRouteReuseStrategy } from './SantaRouteReuseStrategy';

@NgModule({
  declarations: [
    AppRoot
  ],
  imports: [
    // Angular framework modules
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(appReducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    EffectsModule.forRoot([AppEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),

    // 3rd party dependencies
    AgGridModule,

    // Native modules
    CoreModule,
    HomeModule,
    MarketModule,
    TradeModule,
    StructureModule
  ],
  providers: [{
    provide: RouteReuseStrategy,
    useClass: SantaRouteReuseStrategy
  }],
  bootstrap: [AppRoot]
})
export class AppModule { }
