import { Component, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';

// import { IFilterParams } from 'ag-grid-community';
import { ICellRendererAngularComp  } from 'ag-grid-angular';

@Component({
  selector: 'santa-table-full-width-cell-renderer',
  templateUrl: `./santa-table-full-width-cell-renderer.component.html`,
  styleUrls: ['./santa-table-full-width-cell-renderer.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class SantaTableFullWidthCellRenderer implements ICellRendererAngularComp {

  agInit(params): void {
    console.log('dan test, params is', params);
    // this.data = params.node.data;
  }

  refresh(): boolean {
    return true;
  }

  mouseWheelListener(event) {
      event.stopPropagation();
  };

}