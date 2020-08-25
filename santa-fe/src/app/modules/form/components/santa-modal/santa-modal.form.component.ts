import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Component({ 
  selector: 'santa-modal', 
  templateUrl: 'santa-modal.form.component.html', 
  styleUrls: ['santa-modal.form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SantaModal implements OnInit, OnDestroy {
  private modalElement: Node;

  constructor(private elementRef: ElementRef){
    this.modalElement = elementRef.nativeElement;
  }

  public ngOnInit() {
    document.body.appendChild(this.modalElement);
  }

  public ngOnDestroy() {

  }

  public openModal() {
    
  }
}