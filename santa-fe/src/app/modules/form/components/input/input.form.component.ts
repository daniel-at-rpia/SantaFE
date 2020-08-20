import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';

@Component({
  selector: 'santa-input',
  templateUrl: './input.form.component.html',
  styleUrls: ['./input.form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class SantaInput implements OnChanges{
  @Input() inputValue: string;
  @Input() placeholder: string;
  @Input() isHero: boolean;
  @Input() isNumeric: boolean;
  @Input() hasError: boolean;
  @Output() onInputChange = new EventEmitter<String>();
  constructor(
  ) {
  }

  public ngOnChanges() {
    // nothing to do atm
  }

  onKey() {
    this.onInputChange.emit(this.inputValue);
  }

}
