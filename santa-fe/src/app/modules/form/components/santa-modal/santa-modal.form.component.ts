import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Component({ 
  selector: 'santa-modal', 
  templateUrl: 'santa-modal.form.component.html', 
  styleUrls: ['santa-modal.form.component.less'],
  encapsulation: ViewEncapsulation.None
})

export class SantaModal {
  private innerContent: any;

  constructor(private elementRef: ElementRef){
    this.innerContent = elementRef;
  }

  public openModal() {
    
  }
}