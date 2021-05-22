import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store/store';
import { loadUserData } from './store/actions/userDataAction';

const pk = 'bbaareqdduw5i2nsibxkizuxv4fycv6iwre4zxm66igp4e62nnnuacc3a4y4z47j26pjg7wspppr35njgv6ii6ot7k64wrvvpe57csnnsh76di'

// store.dispatch(loadUserData(pk));
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
