// @flow
import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomeContainer from './home/HomeContainer';
import { GlobalStyle } from '../ui/defaultStyles';

function App({ store }: any) {
    return (
        <Provider store={store}>
            <>
                <GlobalStyle />
                {/* $FlowFixMe */}
                <Router basename={`${process.env.PUBLIC_URL}`}>
                    <Switch>
                        <Route path="/" component={HomeContainer} />
                    </Switch>
                </Router>
            </>
        </Provider>
    );
}

export default App;
