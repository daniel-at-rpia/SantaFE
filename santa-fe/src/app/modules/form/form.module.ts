import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SantaInput } from './components/input/input.form.component';
import { SantaLoadableButton } from './components/loadable-button/loadable-button.form.component';

@NgModule({
  declarations: [
    SantaInput,
    SantaLoadableButton
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    SantaInput,
    SantaLoadableButton
  ],
  providers: [
  ]
})
export class FormModule { }
