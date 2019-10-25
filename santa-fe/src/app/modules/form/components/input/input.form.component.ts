import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'santa-input',
  templateUrl: './input.form.component.html',
  styleUrls: ['./input.form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class SantaInput {
  @Input() inputValue: string;
  @Input() placeholder: string;
  @Output() onInputChange = new EventEmitter<String>();
  constructor(
  ) {
  }

  onKey() {
    this.onInputChange.emit(this.inputValue);
  }

}
