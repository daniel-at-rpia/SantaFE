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
  @Input() isGrayedOut: boolean;
  @Input() isDisabled: boolean;
  @Input() isNonEditable: boolean;
  @Output() onInputChange = new EventEmitter<string>();
  @Output() onInputFocus = new EventEmitter();
  @Output() onInputBlur = new EventEmitter();
  @Output() onEnterKeyPressed = new EventEmitter<string>();
  constructor(
  ) {
  }

  public ngOnChanges() {
    // nothing to do atm
  }

  public onKey() {
    !!this.onInputChange && this.onInputChange.emit(this.inputValue);
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
