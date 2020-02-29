import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { MdAddShoppingCart } from 'react-icons/md';
import { bindActionCreators } from 'redux';

import { formatPrice } from '../../util/format';

import api from '../../services/api';

import { ProductList } from './styles';
import * as CartActions from '../../store/modules/cart/actions';

function Home({ amount, addToCartRequest }) {
  const [products, setProducts] = useState([]);

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
    addToCartRequest(id);
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

const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, prod) => {
    amount[prod.id] = prod.amount;
    return amount;
  }, {}),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);

/**
 * Connect do react-redux retorna uma função que chama a Home
 *
 * mapDispathToProps transforma elementos do dispatch em elementos das props
 *
 */
