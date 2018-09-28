import 'babel-polyfill';
import 'url-search-params-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import strings from './translations';
import { TextDecoder } from 'text-encoding';

if (!window.TextDecoder) window.TextDecoder = TextDecoder;

window.dojoConfig = {
    locale: strings.getLanguage(),
};

ReactDOM.render(<App store={store} />, document.getElementById('root'));
registerServiceWorker();
