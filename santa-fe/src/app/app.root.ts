import { Component } from '@angular/core';
import { LicenseManager } from 'ag-grid-enterprise';

@Component({
  selector: 'app-root',
  templateUrl: './app.root.html'
})
export class AppRoot {
  title = 'santa-fe';

  constructor() {
    LicenseManager.setLicenseKey("RPIA_RPIA_Risk_Reporting_1Devs13_March_2019__MTU1MjQzNTIwMDAwMA==7be91d469fa0bf581cca26d77da1f928");
  }
}
