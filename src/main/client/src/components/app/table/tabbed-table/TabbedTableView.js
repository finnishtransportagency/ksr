// @flow
import React, { Fragment } from 'react';

import ReactTableContainer from './../react-table/ReactTableContainer';
import { WrapperTabbedTable, ButtonTabbedTableTab } from './styles';

type Props = {
    layers: Array<Object>,
    activeTable: string,
    setActiveTable: Function,
};

const TabbedTableView = ({ layers, activeTable, setActiveTable }: Props) => (
    <Fragment>
        <WrapperTabbedTable>
            {
                layers.map(l => (
                    <ButtonTabbedTableTab
                        key={l.id}
                        flat
                        title={l.title}
                        active={activeTable === l.id}
                        onClick={() => setActiveTable(l.id)}
                    >
                        {l.title}
                    </ButtonTabbedTableTab>
                ))
            }
        </WrapperTabbedTable>
        <ReactTableContainer />
    </Fragment>
);

export default TabbedTableView;
