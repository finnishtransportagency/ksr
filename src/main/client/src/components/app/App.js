// @flow
import React from 'react';
import { Provider } from 'react-redux';
import { injectGlobal } from 'styled-components';
import * as styles from '../ui/defaultStyles';
import HomeContainer from './home/HomeContainer';

const App = ({ store }: any) => (
    <Provider store={store}>
        <HomeContainer />
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
