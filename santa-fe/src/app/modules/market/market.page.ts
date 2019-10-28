import { Component, ViewEncapsulation } from '@angular/core';
import { MarketState } from 'FEModels/frontend-page-states.interface';

@Component({
  selector: 'santa-market',
  templateUrl: './market.page.html',
  styleUrls: ['./market.page.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class MarketPage {
  pageState: MarketState;

  constructor() { }

}
