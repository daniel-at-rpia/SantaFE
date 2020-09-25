import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';

import { DTOService } from 'Core/services/DTOService';
import { SantaModalDTO } from 'FEModels/frontend-models.interface';
import { ModalService } from 'Form/services/ModalService';

@Component({ 
  selector: 'santa-modal', 
  templateUrl: 'santa-modal.form.component.html', 
  styleUrls: ['santa-modal.form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SantaModal implements OnInit, OnDestroy {
  @Input() modalId: string;
  private modalData: SantaModalDTO;

  constructor(
    private elementRef: ElementRef,
    private dtoService: DTOService,
    private modalService: ModalService
  ){
    this.modalData = this.dtoService.formSantaModal(elementRef);
  }

  public ngOnInit() {
    this.modalData.data.id = this.modalId;
    this.modalData.api.openModal = this.openModal.bind(this);
    this.modalData.api.closeModal = this.closeModal.bind(this);
    document.body.appendChild(this.modalData.data.modalElement);
    this.modalService.registerModal(this.modalData);
  }


  public ngOnDestroy() {

  }

  public openModal() {
    this.modalData.state.isPresenting = true;
  }

  public closeModal() {
    this.modalData.state.isPresenting = false;
  }

  public saveModal() {
    if (!!this.modalData.api.saveModal) {
      const canClose = this.modalData.api.saveModal();
      if (canClose) {
        this.modalData.state.isPresenting = false;
      }
    } else {
      this.modalData.state.isPresenting = false;
    }
  }
}