// @flow
import React, { Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import strings from '../../../../translations';

import ReactTableContainer from '../react-table/ReactTableContainer';
import {
    WrapperTabbedTable,
    ButtonWrapper,
    ButtonTabbedTableTab,
    ButtonIcon,
} from './styles';
import MapLayerTitle from '../../shared/MapLayerTitle';

type Props = {
    layers: Array<Object>,
    activeTable: string,
    setActiveTable: Function,
    activeAdmin: string,
    showConfirmModal: (
        body: string,
        acceptText: string,
        cancelText: string,
        accept: Function
    ) => void,
    closeTableTab: Function,
};

const TabbedTableView = ({
    layers,
    activeTable,
    setActiveTable,
    activeAdmin,
    showConfirmModal,
    closeTableTab,
}: Props) => (
    <Fragment>
        <WrapperTabbedTable>
            <Scrollbars
                autoHide
                renderThumbHorizontal={scrollProps => (
                    <div {...scrollProps} style={{ backgroundColor: 'rgba(255, 255, 255, 0.4', height: '3px' }} />
                )}
            >
                {
                    layers.map(l => (
                        <ButtonWrapper key={l.id}>
                            <ButtonTabbedTableTab
                                admin={activeAdmin === l.id.replace('.s', '')}
                                flat
                                title={l.title}
                                active={activeTable === l.id}
                                onClick={() => {
                                    setActiveTable(l.id);
                                    if (document.getElementsByClassName('rtable-scroll-wrapper').length) {
                                        document.getElementsByClassName('rtable-scroll-wrapper')[0].scrollTop = 0;
                                        document.getElementsByClassName('rtable-scroll-wrapper')[0].scrollLeft = 0;
                                    }
                                }}
                            >
                                <MapLayerTitle layer={l} />
                            </ButtonTabbedTableTab>
                            <ButtonIcon
                                title={strings.modalClearTableTab.info}
                                active={activeTable === l.id}
                                onClick={() => {
                                    showConfirmModal(
                                        strings.modalClearTableTab.content,
                                        strings.modalClearTableTab.submit,
                                        strings.modalClearTableTab.cancel,
                                        () => {
                                            closeTableTab(l.id);
                                        },
                                    );
                                }}
                                className="fas fa-times"
                            />
                        </ButtonWrapper>
                    ))
                }
            </Scrollbars>
        </WrapperTabbedTable>
        <ReactTableContainer />
    </Fragment>
);

export default TabbedTableView;
