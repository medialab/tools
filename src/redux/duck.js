import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';

import {default as gFetchData} from '../lib/fetchData';
import {
  default as analyzeData,
  consumeFilters,
  initFilters
} from '../lib/analyzeData';

/*
 * Action names
 */
const FETCH_DATA = 'FETCH_DATA';
const SET_FREE_TEXT_FILTER = 'SET_FREE_TEXT_FILTER';
const SET_CATEGORY_FILTER = 'SET_CATEGORY_FILTER';

/*
 * Action creators
 */

 export const fetchData = () => ({
  type: FETCH_DATA,
  promise: (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      gFetchData('1oodGx-QVRW8aiKJVPZGLg4o0oOY1lsmsZSj3mlz9xSM', (sheets) => {
        return resolve(sheets);
      });
    });
  }
 });

 export const setFreeTextFilter = (filterString) => ({
  type: SET_FREE_TEXT_FILTER,
  payload: filterString
 });

/*
 * Expected - e.g. with a boolean:
 {
  key: by_dev,
  acceptedValues: [
    true,
    false
  ]
 }
 * Expected - e.g. with a tag:
 {
  key: tags,
  acceptedValues: [
    'cartography'
  ]
 }
 */
export const setCategoryFilter = (filter) => ({
  type: SET_CATEGORY_FILTER,
  payload: filter
});

/*
 * Reducers
 */

const GUI_DEFAULT_STATE = {
};
function gui(state = GUI_DEFAULT_STATE, action) {
  switch (action.type) {
    default:
      return state;
  }
}

const DATA_DEFAULT_STATE = {
  allTools: [],
  filteredTools: [],
  filtersModels: [],
  filters: []
}

function data(state = DATA_DEFAULT_STATE, action) {
  switch (action.type) {

    case SET_CATEGORY_FILTER:
      const filters = state.filters.map(filter => {
        if (filter.key === action.payload.key) {
          return {
            ...filter,
            acceptedValues: action.payload.acceptedValues
          }
        }
        return filter;
      });
      return {
        ...state,
        filters,
        filteredTools: consumeFilters(state.allTools, filters)
      };
    case FETCH_DATA + '_SUCCESS':
      const {allTools, filters: filtersInit} = analyzeData(action.result);
      const filledFilters = initFilters(filtersInit, allTools);
      return {
        ...state,
        allTools: allTools.slice(),
        filteredTools: allTools.slice(),
        filters: filledFilters
      };
    default:
      return state;
  }
}

export default combineReducers({
  gui,
  data
});

/*
 * Selectors
 */

const allTools = state => state.data.allTools || [];
const filteredTools = state => state.data.filteredTools || [];
const filters = state => state.data.filters || [];

export const selector = createStructuredSelector({
  allTools,
  filteredTools,
  filters
});
