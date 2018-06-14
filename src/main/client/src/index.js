import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import registerServiceWorker from './registerServiceWorker';
import store from './store';

ReactDOM.render(<App store={store} />, document.getElementById('root'));
registerServiceWorker();
