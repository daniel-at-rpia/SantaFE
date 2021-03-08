import { Injectable } from '@angular/core';
import { AdhocPacks } from '../models/frontend';
import { BESecurityMap } from 'Core/models/backend/backend-models.interface';
@Injectable()

export class SecurityMapService {
  private securityMap: Array<AdhocPacks.SecurityMapEntry>

  public storeSecurityMap(serverReturn: BESecurityMap) {
    const map: Array<AdhocPacks.SecurityMapEntry> = [];
    for (const eachSecurityId in serverReturn) {
      map.push({
        keywords: serverReturn[eachSecurityId],
        secruityId: eachSecurityId
      });
    }
    this.securityMap = map;
  }

  public getSecurityMap(): Array<AdhocPacks.SecurityMapEntry> {
    return this.securityMap;
  }

  public getSecurityName(id: string): string | null{
    if (this.securityMap && this.securityMap.length > 0) {
      const matchedSecurity = this.securityMap.find((security: AdhocPacks.SecurityMapEntry) => security.secruityId === id);
      if (!!matchedSecurity) {
        const [ securityName ] = matchedSecurity.keywords;
        return securityName;
      } else {
        return null;
      }
    }
  }
}