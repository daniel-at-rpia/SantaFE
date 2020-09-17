import {Component, Input,OnInit, ViewEncapsulation} from '@angular/core';
import { PortfolioBreakdownCategoryBlock } from 'App/modules/core/models/frontend/frontend-blocks.interface';

@Component({
  selector: 'category-content-list-item',
  templateUrl: './category-content-list-item.component.html',
  styleUrls: ['./category-content-list-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class CategoryContentListItem implements OnInit {
  @Input() isBtnDiveIn: boolean;
  @Input() eachCategory: PortfolioBreakdownCategoryBlock;
  @Input() stencilState: boolean;
  constructor() {}
  public ngOnInit() {};
}