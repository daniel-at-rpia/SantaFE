import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';

interface BasicFormDTOStructure {
  data: object;
  state: object;
  style?: object;
  api?: object;
}

export interface SantaDatePicker extends BasicFormDTOStructure {
  data: {
    triggerLabel: string;
  },
  api: {
    formControl: FormControl;
    datepicker: MatDatepicker<moment.Moment>;
  }
  state: {
    noInputVariant: boolean;
    opened: boolean;
  }
}
