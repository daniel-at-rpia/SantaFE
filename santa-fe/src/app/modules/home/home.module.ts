import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home.page';

@NgModule({
  declarations: [ HomePage ],
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
