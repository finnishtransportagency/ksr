import 'react-app-polyfill/ie11';
import 'core-js/stable';
import 'url-search-params-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { TextDecoder } from 'text-encoding';

import App from './components/app/App';
import store from './store';
import strings from './translations';

if (!window.TextDecoder) window.TextDecoder = TextDecoder;

window.dojoConfig = {
    locale: strings.getLanguage(),
};

ReactDOM.render(<App store={store} />, document.getElementById('root'));
