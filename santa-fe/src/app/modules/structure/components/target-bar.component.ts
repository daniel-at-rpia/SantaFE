import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import { TargetBarDTO } from 'App/modules/core/models/frontend/frontend-models.interface';

@Component({
  selector: 'target-bar',
  templateUrl: './target-bar.component.html',
  styleUrls: ['./target-bar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TargetBar implements OnInit {
  @Input() targetBar: TargetBarDTO;
  constructor() {}

  public ngOnInit() {}
  
}