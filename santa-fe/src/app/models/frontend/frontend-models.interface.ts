export interface securityDTO {
  data: {
    name: string;
    ratingLevel: number;
    ratingValue: string;
    seniorityLevel: number;
  }
  state: {
    isStencil: boolean;
    isTable: boolean;
    isSelected: boolean;
  }
}

export interface securityGroupDTO {
  data: {
    name: string;
    ratingLevel: number;
    ratingValue: string;
    seniorityLevel: number;
  }
  state: {
    isStencil: boolean;
    isSelected: boolean;
  }
}