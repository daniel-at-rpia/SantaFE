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
    inputLabelDisplay: string;
    inputLabelEmpty: string;
    inputLabelFilled: string;
    minDate: moment.Moment;
    maxDate: moment.Moment;
  },
  api: {
    datepicker: MatDatepicker<moment.Moment>;
  }
  state: {
    noInputVariant: boolean;
    opened: boolean;
  }
}
