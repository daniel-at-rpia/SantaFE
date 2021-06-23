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
  @Input() watchlistData: WatchlistDTO;
  @Output() onClickWatchlistCallback = new EventEmitter<WatchlistDTO>();
  @Output() onChangeWatchlistNameCallback = new EventEmitter<string>();
  constructor(
  ) {
  }

  public onClickWatchlist() {
    if (!this.watchlistData.state.isUserInputBlocked) {
      this.onClickWatchlistCallback.emit(this.watchlistData);
    }
  }

  public onChangeWatchlistName(newName: string) {
    !!this.onChangeWatchlistNameCallback && this.onChangeWatchlistNameCallback.emit(newName);
  }

}
