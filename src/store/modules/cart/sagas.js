import { call, select, put, all, takeLatest } from 'redux-saga/effects';
/**
 * call é responsável por chamar métodos asincronos que retornam uma promise
 */
import { toast } from 'react-toastify';

import { addToCartSuccess, updateAmountSuccess } from './actions';

import api from '../../../services/api';
import history from '../../../services/history';
import { formatPrice } from '../../../util/format';

function* addToCart({ id }) {
  const response = yield call(api.get, `/products/${id}`);
  // tratavivas do produto antes de ser adicionado ao carrinho
  // verifica se o produto já existe no carrinho
  const exists = yield select(state => state.cart.find(p => p.id === id));
  // busca a referencia do produto no estoque
  const stock = yield call(api.get, `stock/${id}`);
  // armazena somente o valor do amount estoque
  const stockAmount = stock.data.amount;
  // armazena o valor do amount antes da adição do novo produto
  // se o produto já existe armazena o valor se não existe vale 0
  const currentAmount = exists ? exists.amount : 0;
  // define o novo amount do produto
  const amount = currentAmount + 1;

  // se o novo amount for maior que o estoque disponível retorna erro
  if (amount > stockAmount) {
    // exibe o alerta na tela
    toast.error('Estoque Insulficiente');
    return;
  }

  if (exists) {
    // se existe só altera a quantidade
    yield put(updateAmountSuccess(id, amount));
  } else {
    // se não existe adiciona o novo produto
    const data = {
      ...response.data,
      amount,
      priceFormatted: formatPrice(response.data.price),
    };
    yield put(addToCartSuccess(data));
    // redirecionando o usuario para o carrinho
    history.push('/cart');
  }
}

/**
 * [*] depois da função singnifica generate, equivale a um async
 * é mais 'potente' que o async
 * o yield equivale ao await
 * select é responsável por buscar informações dentro do estado
 * sempre que usar um effects do saga necessita utilizar yield na frente
 */

function* updateAmount({ id, amount }) {
  // se o amount for menor ou igual a zero para aqui
  if (amount <= 0) return;
  // busca seu estoque na api
  const stock = yield call(api.get, `stock/${id}`);
  // armazena a quantidade do estoque
  const stockAmount = stock.data.amount;

  // verifica se o amount é maior que o estoque e retorna um erro
  if (amount > stockAmount) {
    toast.error('Estoque insulficiente');
    return;
  }
  // se o estoque é compativel atualiza o carrinho
  yield put(updateAmountSuccess(id, amount));
}

export default all([
  takeLatest('@cart/ADD_REQUEST', addToCart),
  takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
]);
