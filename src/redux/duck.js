import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';

import {default as gFetchData} from '../lib/fetchData';
import {
  default as analyzeData,
  consumeFilters,
  consumeFreeTextFilter,
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
  filters: [],
  dataLoaded: false,
  freeTextFilter: ''
}

function data(state = DATA_DEFAULT_STATE, action) {
  switch (action.type) {

    case SET_FREE_TEXT_FILTER:
      const searchStr = action.payload;
      const filtered = consumeFilters(state.allTools, state.filters);
      const searched = searchStr.length < 3 ? filtered : consumeFreeTextFilter(filtered, searchStr);
      return {
        ...state,
        freeTextFilter: searchStr,
        filteredTools: searched
      };

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
        dataLoaded: true,
        allTools: allTools.slice(),
        filteredTools: allTools.slice(),
        filters: filledFilters
      };
    case FETCH_DATA + '_FAILURE':
      return {
        ...state,
        dataLoaded: true
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
const freeTextFilter = state => state.data.freeTextFilter || '';
const isDataLoaded = state => state.data.dataLoaded || false;

export const selector = createStructuredSelector({
  allTools,
  filteredTools,
  isDataLoaded,
  freeTextFilter,
  filters
});
