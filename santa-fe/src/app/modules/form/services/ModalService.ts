import { Injectable } from '@angular/core';
import { SantaModalDTO } from "FEModels/frontend-models.interface";

@Injectable()
export class ModalService {
  private registeredModals: Array<SantaModalDTO> = [];

  public registerModal(targetModal: SantaModalDTO) {
    if (!!targetModal && !!targetModal.data.id) {
      const exist = this.registeredModals.find((eachModal) => {
        return eachModal.data.id === targetModal.data.id;
      });
      if (!exist) {
        this.registeredModals.push(targetModal);
      }
    }
  }

  public triggerModalOpen(targetModalId: string) {
    const exist = this.registeredModals.find((eachModal) => {
      return eachModal.data.id === targetModalId;
    });
    if (!!exist) {
      exist.api.openModal();
    }
  }

  public triggerModalClose(targetModalId: string) {
    const exist = this.registeredModals.find((eachModal) => {
      return eachModal.data.id === targetModalId;
    });
    if (!!exist) {
      exist.api.closeModal();
    }
  }

  public bindModalSaveCallback(
    targetModalId: string,
    callback: () => boolean
  ) {
    const exist = this.registeredModals.find((eachModal) => {
      return eachModal.data.id === targetModalId;
    });
    if (!!exist) {
      exist.api.saveModal = callback;
    }
  }
}