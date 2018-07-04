// @flow
import React from 'react';

import ReactTableContainer from './../react-table/ReactTableContainer';
import { WrapperTabbedTable, ButtonTabbedTableTab } from './styles';

type Props = {
    layers: Array<Object>,
    activeTable: string,
    setActiveTable: Function,
};

const TabbedTableView = ({ layers, activeTable, setActiveTable }: Props) => (
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
        <ReactTableContainer />
    </WrapperTabbedTable>
);

export default TabbedTableView;
