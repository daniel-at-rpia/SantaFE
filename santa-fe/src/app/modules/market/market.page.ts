import { Component } from '@angular/core';
import { MarketState } from 'FEModels/frontend-page-states.interface';

@Component({
  selector: 'santa-market',
  templateUrl: './market.page.html',
  styleUrls: ['./market.page.scss']
})
export class MarketPage {
  pageState: MarketState;

  constructor() { }

}
