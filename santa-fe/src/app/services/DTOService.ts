import { Injectable } from '@angular/core';
import { BESecurityDTO } from 'app/models/backend/backend-models.interface';
import { securityDTO } from 'app/models/frontend/frontend-models.interface';
import { UtilityService } from './UtilityService';

@Injectable()
export class DTOService {
  constructor(
    private utility: UtilityService
  ){}

  public formSecurityCardObject(
    rawData: BESecurityDTO
  ): securityDTO {
    const ratingLevel = Math.floor(Math.random()*7 + 1);
    const object:securityDTO = {
      name: rawData.name,
      ratingLevel: ratingLevel,
      ratingValue: this.utility.mapRatings(ratingLevel),
      seniorityLevel: Math.floor(Math.random()*5 + 1)
    };
    return object;
  }
}