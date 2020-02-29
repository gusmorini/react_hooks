import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
// para enviar mensagens na tela
import { ToastContainer } from 'react-toastify';

// configuração reactotron
// deve vir antes da importação do store
import './config/ReactotronConfig';

import GlobalStyle from './styles/global';
import Header from './components/Header';
import Routes from './routes';

import history from './services/history';

import store from './store';

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <GlobalStyle />
        <Header />
        <Routes />
        <ToastContainer autoClose={3000} />
      </Router>
    </Provider>
  );
}

export default App;

/*
  provider disponibiliza as variáveis globais do redux
*/
