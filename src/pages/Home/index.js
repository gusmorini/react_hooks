import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdAddShoppingCart } from 'react-icons/md';

import { formatPrice } from '../../util/format';

import api from '../../services/api';

import { ProductList } from './styles';
import { addToCartRequest } from '../../store/modules/cart/actions';

export default function Home() {
  const [products, setProducts] = useState([]);

  const amount = useSelector(state =>
    state.cart.reduce((sumAmount, product) => {
      sumAmount[product.id] = product.amount;
      return sumAmount;
    }, {})
  );

  const dispatch = useDispatch();

  // maneira de usar async await dentro do useEffect
  // cria uma nova função e chama ela mesma no final
  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('products');
      const data = response.data.map(pro => ({
        ...pro,
        priceFormatted: formatPrice(pro.price),
      }));
      setProducts(data);
    }
    loadProducts();
  }, []);
  // passar array vazio como dependencia no final para executar apenas uma vez o useEffect

  // não se usa arrow function dentro de uma function()
  function handleAddProduct(id) {
    dispatch(addToCartRequest(id));
  }

  return (
    <ProductList>
      {products.map(pro => (
        <li key={String(pro.id)}>
          <img src={pro.image} alt={pro.title} />
          <strong>{pro.title}</strong>
          <span>{pro.priceFormatted}</span>

          <button type="button" onClick={() => handleAddProduct(pro.id)}>
            <div>
              <MdAddShoppingCart /> {amount[pro.id] || 0}
            </div>
            <span>Adicionar ao Carrinho</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
}
