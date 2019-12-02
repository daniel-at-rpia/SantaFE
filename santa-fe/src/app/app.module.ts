import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
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

import { AppRoot } from './app.root';

@NgModule({
  declarations: [
    AppRoot
  ],
  imports: [
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
      maxAge: 5,
      logOnly: environment.production
    }),

    // Native modules
    CoreModule,
    HomeModule,
    MarketModule,
    TradeModule
  ],
  providers: [
  ],
  bootstrap: [AppRoot]
})
export class AppModule { }
