import { Action } from '@ngrx/store';
import { StructureActions } from 'Structure/actions/structure.actions';
import {
  PortfolioMetricValues,
  BreakdownViewFilter,
  PortfolioShortNames,
  SubPortfolioFilter,
  DeltaScope
} from 'Core/constants/structureConstants.constants';
import {
  StructureSetTargetOverlayTransferPack,
  StructureSetViewTransferPack,
} from 'FEModels/frontend-adhoc-packages.interface';
import { BEStructuringFundBlockWithSubPortfolios } from 'BEModels/backend-models.interface';
import { StructureUtilityPanelState } from 'FEModels/frontend-page-states.interface';
import * as moment from 'moment';

export interface StructureState {
  selectedMetric: string;
  setTargetTransfer: StructureSetTargetOverlayTransferPack;
  reloadFundDataPostEdit: BEStructuringFundBlockWithSubPortfolios;
  updateTick: number;
  viewData: StructureSetViewTransferPack;
  activeBreakdownViewFilter: BreakdownViewFilter;
  activePortfolioViewFilter: Array<PortfolioShortNames>;
  activeSubPortfolioFilter: SubPortfolioFilter;
  activeDeltaScope: DeltaScope;
  dataDatestamp: number;
  utilityPanelLoadState: StructureUtilityPanelState;
}

const initialState: StructureState = {
  selectedMetric: PortfolioMetricValues.cs01,
  setTargetTransfer: null,
  reloadFundDataPostEdit: null,
  updateTick: 0,
  viewData: null,
  activeBreakdownViewFilter: BreakdownViewFilter.all,
  activePortfolioViewFilter: [
    PortfolioShortNames.FIP,
    PortfolioShortNames.BBB,
    PortfolioShortNames.CIP,
    PortfolioShortNames.STIP,
    PortfolioShortNames.AGB,
    PortfolioShortNames.DOF,
    PortfolioShortNames.SOF
  ],
  activeSubPortfolioFilter: SubPortfolioFilter.all,
  activeDeltaScope: DeltaScope.dod,
  dataDatestamp: moment().unix(),
  utilityPanelLoadState: null
}

export function structureReducer(
  state = initialState,
  action
): StructureState {
  switch(action.type) {
    case StructureActions.StructureStoreReset:
      return initialState;
    case StructureActions.SelectedMetricLevel:
      return {
        ...state,
        selectedMetric: action.selectedMetric
      };
    case StructureActions.SendSetTargetTransfer:
      return {
        ...state,
        setTargetTransfer: action.pack
      };
    case StructureActions.ReloadBreakdownDataPostEdit:
      return {
        ...state,
        reloadFundDataPostEdit: action.targetRawFund
      }
    case StructureActions.SetView:
      return {
        ...state,
        viewData: action.viewData
      }
    case StructureActions.UpdateMainPanel:
      return {
        ...state,
        updateTick: state.updateTick + 1
      };
    case StructureActions.ChangeBreakdownViewFilter:
      return {
        ...state,
        activeBreakdownViewFilter: action.filterOption
      };
    case StructureActions.ChangePortfolioViewFilter:
      return {
        ...state,
        activePortfolioViewFilter: action.filterOption
      };
    case StructureActions.SwitchDataDatestamp:
      return {
        ...state,
        dataDatestamp: action.dateStampInUnix
      };
    case StructureActions.ChangeSubPortfolioViewFilter:
      return {
        ...state,
        activeSubPortfolioFilter: action.filterOption
      }
    case StructureActions.ChangeDeltaScope:
      return {
        ...state,
        activeDeltaScope: action.deltaScope
      }
    case StructureActions.UtilityPanelLoadState:
      return {
        ...state,
        utilityPanelLoadState: action.panelState
      };
    default:
      return state;
  }
}

export function reducer(state: StructureState, action: Action) {
  return structureReducer(state,action);
}