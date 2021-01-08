import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter'
import {MatTableModule} from '@angular/material/table';

import { SantaInput } from './components/input/input.form.component';
import { SantaLoadableButton } from './components/loadable-button/loadable-button.form.component';
import { MetricSelectionDropdown } from './components/metric-selection-dropdown/metric-selection-dropdown.component';
import { SantaModal } from './components/santa-modal/santa-modal.form.component';
import { ModalService } from './services/ModalService';
import { SantaTextarea } from './components/textarea/textarea.form.component';
import { SantaDatepicker } from './containers/santa-datepicker/santa-datepicker.form.container';

@NgModule({
  declarations: [
    SantaInput,
    SantaLoadableButton,
    MetricSelectionDropdown,
    SantaModal,
    SantaTextarea,
    SantaDatepicker
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTableModule
  ],
  exports: [
    SantaInput,
    SantaLoadableButton,
    MetricSelectionDropdown,
    SantaModal,
    SantaTextarea,
    SantaDatepicker
  ],
  providers: [
    ModalService
  ]
})
export class FormModule { }
