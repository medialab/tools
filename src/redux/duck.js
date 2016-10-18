import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';

/*
 * Action names
 */

const SAY_COUCOU = 'SAY_COUCOU';

/*
 * Action creators
 */

export const sayCoucou = () => ({
  type: SAY_COUCOU
});

/*
 * Reducers
 */

const DEFAULT_STATE = {
    coucou: false,
};
function gui(state = DEFAULT_STATE, action) {
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

export default combineReducers({
  gui,
});

/*
 * Selectors
 */
 const saidCoucou = state => state.tools.coucou;

export const selector = createStructuredSelector({
  saidCoucou
});
