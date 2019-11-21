import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SantaInput } from './components/input/input.form.component';
import { SantaLoadableButton } from './components/loadable-button/loadable-button.form.component';
import { MetricSelectionDropdown } from './components/metric-selection-dropdown/metric-selection-dropdown.component';

@NgModule({
  declarations: [
    SantaInput,
    SantaLoadableButton,
    MetricSelectionDropdown
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    SantaInput,
    SantaLoadableButton,
    MetricSelectionDropdown
  ],
  providers: [
  ]
})
export class FormModule { }
