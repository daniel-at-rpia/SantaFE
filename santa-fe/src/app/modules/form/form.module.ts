import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SantaInput } from './components/input.form.component';

@NgModule({
  declarations: [
    SantaInput
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    SantaInput
  ],
  providers: [
  ]
})
export class FormModule { }
