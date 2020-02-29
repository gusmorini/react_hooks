import { combineReducers } from 'redux';

import cart from './cart/reducer';

export default combineReducers({
  cart,
});

/**
 * combina todos os reducers existentes na aplicação em um único
 */
