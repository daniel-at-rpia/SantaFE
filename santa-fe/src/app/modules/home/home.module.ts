import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home.page';
import { HomeContainer } from './containers/home.container';

@NgModule({
  declarations: [
    HomePage,
    HomeContainer
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'home', component: HomePage
      }
    ])
  ]
})
export class HomeModule { }
