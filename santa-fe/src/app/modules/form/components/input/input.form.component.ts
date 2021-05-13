import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'santa-input',
  templateUrl: './input.form.component.html',
  styleUrls: ['./input.form.component.scss'],
  encapsulation: ViewEncapsulation.None // needs to be None because we are overwriting Angular Material's internal stylings, which has components that are generated within the "mat-form-field" component itself
})

export class SantaInput implements OnChanges{
  @Input() inputValue: string;
  @Input() placeholder: string;
  @Input() isHero: boolean;
  @Input() isNumeric: boolean;
  @Input() hasError: boolean;
  @Input() isGrayedOut: boolean;
  @Input() isDisabled: boolean;
  @Input() isNonEditable: boolean;
  @Input() autoFocus: boolean;
  @Input() label: string;
  @Output() onInputChange = new EventEmitter<string>();
  @Output() onInputFocus = new EventEmitter();
  @Output() onInputBlur = new EventEmitter();
  @Output() onEnterKeyPressed = new EventEmitter<string>();
  @Output() onGenericKeyPressed = new EventEmitter<KeyboardEvent>();

  public formControl = new FormControl(null);
  
  constructor(
  ) {
  }

  public ngOnChanges() {
    console.log('test, within input, input value is', this.inputValue);
  }

  public onKey() {
    !!this.onInputChange && this.onInputChange.emit(this.inputValue);
  }

  public onPressedGenericKey(event: KeyboardEvent) {
    // need to pass out entire event in case outside needs to prevent default
    !!this.onGenericKeyPressed && this.onGenericKeyPressed.emit(event);
  }

  public onFocus() {
    !!this.onInputFocus && this.onInputFocus.emit();
  }

  public onBlur() {
    !!this.onInputBlur && this.onInputBlur.emit();
  }

  public onPressedEnterKey() {
    !!this.onEnterKeyPressed && this.onEnterKeyPressed.emit(this.inputValue);
  }

}
