import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';

import {default as gFetchData} from '../lib/fetchData';
import {default as analyzeData} from '../lib/analyzeData';

/*
 * Action names
 */
const FETCH_DATA = 'FETCH_DATA';

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
 })

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
  allTools: []
}

function data(state = DATA_DEFAULT_STATE, action) {
  switch (action.type) {
    case FETCH_DATA + '_SUCCESS':
      const {finalObjects: allTools, filters} = analyzeData(action.result);
      return {
        ...state,
        allTools: action.result.tools.elements,
        filters
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

const allTools = state => state.data.allTools;

export const selector = createStructuredSelector({
  allTools
});
