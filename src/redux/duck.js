import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';

import {default as gFetchData} from '../lib/fetchData';

/*
 * Action names
 */

const SAY_COUCOU = 'SAY_COUCOU';

const FETCH_DATA = 'FETCH_DATA';

/*
 * Action creators
 */

 export const fetchData = () => ({
  type: FETCH_DATA,
  promise: (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let hasFetched;
      gFetchData('1oodGx-QVRW8aiKJVPZGLg4o0oOY1lsmsZSj3mlz9xSM', (sheets) => {
        hasFetched = true;
        return resolve(sheets);
      });
    });
  }
 })

export const sayCoucou = () => ({
  type: SAY_COUCOU
});

/*
 * Reducers
 */

const GUI_DEFAULT_STATE = {
    coucou: false,
};
function gui(state = GUI_DEFAULT_STATE, action) {
  switch (action.type) {
    case SAY_COUCOU:
      return {
        ...state,
        coucou: true
      };
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
      return {
        ...state,
        allTools: action.result.tools.elements
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
const saidCoucou = state => state.gui.coucou;

const allTools = state => state.data.allTools;

export const selector = createStructuredSelector({
  saidCoucou,
  allTools
});
