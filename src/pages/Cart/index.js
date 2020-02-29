import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  MdRemoveCircleOutline,
  MdAddCircleOutline,
  MdDelete,
} from 'react-icons/md';

import {
  removeFromCart,
  updateAmountRequest,
} from '../../store/modules/cart/actions';

import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

/**
 * desentruturação da props dentro das chaves
 */

export default function Cart() {
  const { cart, total } = useSelector(state => ({
    cart: state.cart.map(p => ({
      ...p,
      subtotal: formatPrice(p.price * p.amount),
    })),
    total: formatPrice(
      state.cart.reduce((tot, p) => {
        return tot + p.price * p.amount;
      }, 0)
    ),
  }));

  const dispatch = useDispatch();

  function increment(prod) {
    dispatch(updateAmountRequest(prod.id, prod.amount + 1));
  }

  function decrement(prod) {
    dispatch(updateAmountRequest(prod.id, prod.amount - 1));
  }

  /**
   * O action apenas dispara a função
   * as verificações devem ser feitas
   * dentro do reducer Cart
   *
   * quem tem que se virar com a regra de negócio é o reducer
   * o front apenas dispara a função
   */

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th />
            <th>Produto</th>
            <th>Qtd</th>
            <th>Subtotal</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {cart &&
            cart.map(item => (
              <tr key={item.id}>
                <td>
                  <img src={item.image} alt={item.title} />
                </td>
                <td>
                  <strong>{item.title}</strong>
                  <span>{item.priceFormatted}</span>
                </td>
                <td>
                  <div>
                    <button type="button" onClick={() => decrement(item)}>
                      <MdRemoveCircleOutline />
                    </button>
                    <input type="text" readOnly value={item.amount} />
                    <button type="button" onClick={() => increment(item)}>
                      <MdAddCircleOutline />
                    </button>
                  </div>
                </td>
                <td>
                  <strong>{item.subtotal}</strong>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </ProductTable>
      <footer>
        <button type="button">Finalizar Pedido</button>

        <Total>
          <span>Total:</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
}
