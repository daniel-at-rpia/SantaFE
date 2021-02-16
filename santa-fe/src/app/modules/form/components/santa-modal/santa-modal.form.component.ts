import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';

import { DTOService } from 'Core/services/DTOService';
import { SantaModalDTO } from 'FEModels/frontend-models.interface';
import { ModalService } from 'Form/services/ModalService';
import { Store, select } from '@ngrx/store';
@Component({ 
  selector: 'santa-modal', 
  templateUrl: 'santa-modal.form.component.html', 
  styleUrls: ['santa-modal.form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SantaModal implements OnInit, OnDestroy {
  @Input() modalId: string;
  public modalData: SantaModalDTO;
  subscriptions = {
    editStructurePortfolioSub: null
  }
  constructor(
    private elementRef: ElementRef,
    private dtoService: DTOService,
    private modalService: ModalService,
    private store$: Store<any>
  ){}

  public ngOnInit() {
    const exist = this.modalService.modalIsRegistered(this.modalId);
    if (!exist) {
      this.modalData = this.dtoService.formSantaModal(this.elementRef);
      this.modalData.data.id = this.modalId;
      this.modalData.api.openModal = this.openModal.bind(this);
      this.modalData.api.closeModal = this.closeModal.bind(this);
      this.modalService.registerModal(this.modalData);
    } else {
      this.modalData = exist;
      document.body.removeChild(this.modalData.data.modalElement);
      this.modalData.data.modalElement = this.elementRef.nativeElement;
    }
    document.body.appendChild(this.modalData.data.modalElement);
  }

  public ngOnDestroy() {
  }

  public openModal() {
    this.modalData.state.isPresenting = true;
  }

  public closeModal() {
    if (!!this.modalData.api.closeModal) {
      const canClose = this.modalData.api.closeModal();
      if (canClose) {
        this.modalData.state.isPresenting = false;
      }
    } else {
      this.modalData.state.isPresenting = false;
    }
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