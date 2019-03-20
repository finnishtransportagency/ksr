// @flow
import React, { Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import ReactTableContainer from './../react-table/ReactTableContainer';
import { WrapperTabbedTable, ButtonTabbedTableTab } from './styles';
import MapLayerTitle from '../../shared/MapLayerTitle';

type Props = {
    layers: Array<Object>,
    activeTable: string,
    setActiveTable: Function,
    activeAdmin: string,
};

const TabbedTableView = ({ layers, activeTable, setActiveTable, activeAdmin }: Props) => (
    <Fragment>
        <WrapperTabbedTable>
            <Scrollbars
                autoHide
                renderThumbHorizontal={scrollProps =>
                    <div {...scrollProps} style={{ backgroundColor: 'rgba(255, 255, 255, 0.4', height: '3px' }} />}
            >
                {
                    layers.map(l => (
                        <ButtonTabbedTableTab
                            admin={activeAdmin === l.id.replace('.s', '')}
                            key={l.id}
                            flat
                            title={l.title}
                            active={activeTable === l.id}
                            onClick={() => {
                                setActiveTable(l.id);
                                if (document.getElementsByClassName('tbody-scroll-wrapper').length) {
                                    document.getElementsByClassName('tbody-scroll-wrapper')[0].scrollTop = 0;
                                }
                            }}
                        >
                            <MapLayerTitle layer={l} />
                        </ButtonTabbedTableTab>
                    ))
                }
            </Scrollbars>
        </WrapperTabbedTable>
        <ReactTableContainer />
    </Fragment>
);

export default TabbedTableView;
