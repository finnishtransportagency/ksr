// @flow
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { injectGlobal } from 'styled-components';
import * as styles from '../ui/defaultStyles';
import Home from './home/Home';

const App = ({ store }: any) => (
    <Provider store={store}>
        <Router>
            <Switch>
                <Route path="/" component={Home} />
            </Switch>
        </Router>
    </Provider>
);

injectGlobal`
  body {
    margin: 0;
    font-family: Arial, sans-serif;
    font-size: 16px;
    background: ${styles.colorBackgroundLight};
    color: ${styles.colorFontDark};
    
    input, select, textarea, button {
        font-family: inherit;
    }
    
    *::-moz-selection { background: ${styles.colorMain}; }
    *::selection { background: ${styles.colorMain}; }
  }
`;

export default App;
