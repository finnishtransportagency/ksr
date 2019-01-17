// @flow
import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomeContainer from './home/HomeContainer';
import { GlobalStyle } from '../ui/defaultStyles';

const App = ({ store }: any) => (
    <Provider store={store}>
        <Fragment>
            <GlobalStyle />
            {/* $FlowFixMe */}
            <Router basename={`${process.env.PUBLIC_URL}`}>
                <Switch>
                    <Route path="/" component={HomeContainer} />
                </Switch>
            </Router>
        </Fragment>
    </Provider>
);

export default App;
