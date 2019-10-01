import { Injectable } from '@angular/core';
import {
  BESecurityDTO,
  BESecurityGroupDTO
} from 'App/models/backend/backend-models.interface';
import {
  SecurityDTO,
  SecurityGroupDTO
} from 'App/models/frontend/frontend-models.interface';
import { UtilityService } from './UtilityService';

@Injectable()
export class DTOService {
  constructor(
    private utility: UtilityService
  ){}

  public formSecurityCardObject(
    rawData: BESecurityDTO
  ): SecurityDTO {
    const ratingLevel = Math.floor(Math.random()*7 + 1);
    const object:SecurityDTO = {
      data: {
        name: rawData.name,
        ratingLevel: ratingLevel,
        ratingValue: this.utility.mapRatings(ratingLevel),
        seniorityLevel: Math.floor(Math.random()*5 + 1)
      },
      state: {
        isSelected: false,
        isStencil: false,
        isTable: false
      }
    };
    return object;
  }

  public formSecurityGroupObject(
    rawData: BESecurityGroupDTO
  ): SecurityGroupDTO {
    const ratingLevel = Math.floor(Math.random()*7 + 1);
    const object:SecurityGroupDTO = {
      data: {
        name: 'Bond|2Yr|USD',
        ratingLevel: ratingLevel,
        ratingValue: this.utility.mapRatings(ratingLevel),
        numOfSecurities: rawData.numOfSecurities,
        stats: [
          {
            label: 'Attr1',
            value: Math.floor(Math.random()*1000),
            max: 1000,
            percentage: null
          },{
            label: 'Attr2',
            value: Math.floor(Math.random()*1000),
            max: 1000,
            percentage: null
          },{
            label: 'Attr3',
            value: Math.floor(Math.random()*1000)/100,
            max: 10,
            percentage: null
          }
        ]
      },
      state: {
        isSelected: false,
        isStencil: false
      },
      graph: {
        chartNameLeft: `Some Group Name ${rawData.numOfSecurities}-1`,
        chartNameRight: `Some Group Name ${rawData.numOfSecurities}-2`,
        pieChartLeft: null,
        pieChartRight: null
      }
    }
    object.data.stats.forEach((eachStat) => {
      eachStat.percentage = Math.round(eachStat.value/eachStat.max * 10000)/100;
    })
    return object;
  }
}