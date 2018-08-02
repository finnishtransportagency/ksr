// @flow
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { injectGlobal } from 'styled-components';
import * as styles from '../ui/defaultStyles';
import HomeContainer from './home/HomeContainer';

const App = ({ store }: any) => (
    <Provider store={store}>
        {/* $FlowFixMe */}
        <Router basename={`${process.env.PUBLIC_URL}`}>
            <Switch>
                <Route path="/" component={HomeContainer} />
            </Switch>
        </Router>
    </Provider>
);

// eslint-disable-next-line
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
