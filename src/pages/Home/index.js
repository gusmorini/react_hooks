import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MdAddShoppingCart } from 'react-icons/md';
import { bindActionCreators } from 'redux';

import { formatPrice } from '../../util/format';

import api from '../../services/api';

import { ProductList } from './styles';
import * as CartActions from '../../store/modules/cart/actions';

class Home extends Component {
  state = {
    products: [],
  };

  async componentDidMount() {
    const response = await api.get('products');
    const data = response.data.map(pro => ({
      ...pro,
      priceFormatted: formatPrice(pro.price),
    }));
    this.setState({ products: data });
  }

  handleAddProduct = id => {
    const { addToCartRequest } = this.props;
    addToCartRequest(id);
  };

  render() {
    const { products } = this.state;
    const { amount } = this.props;

    return (
      <ProductList>
        {products.map(pro => (
          <li key={String(pro.id)}>
            <img src={pro.image} alt={pro.title} />
            <strong>{pro.title}</strong>
            <span>{pro.priceFormatted}</span>

            <button type="button" onClick={() => this.handleAddProduct(pro.id)}>
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
