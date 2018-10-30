// @flow
import React, { Fragment } from 'react';

// TODO: Input that allows existing contracts to be linked to feature
const LinkContractView = () => (
    <Fragment>
        <label htmlFor="contractNr">Sopimusnmr</label>
        <input type="text" name="contractNr" />
    </Fragment>
);

export default LinkContractView;
