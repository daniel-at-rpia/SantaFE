import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  WatchlistDTO
} from 'FEModels/frontend-models.interface';

@Component({
  selector: 'watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class Watchlist {
  @Input() shortcutData: WatchlistDTO;
  @Output() onClickShortcutCallback = new EventEmitter<WatchlistDTO>();
  @Output() onChangeShortcutNameCallback = new EventEmitter<string>();
  constructor(
  ) {
  }

  public onClickShortcut() {
    if (!this.shortcutData.state.isUserInputBlocked) {
      this.onClickShortcutCallback.emit(this.shortcutData);
    }
  }

  public onChangeShortcutName(newName: string) {
    !!this.onChangeShortcutNameCallback && this.onChangeShortcutNameCallback.emit(newName);
  }

}
