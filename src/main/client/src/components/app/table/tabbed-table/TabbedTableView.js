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
    closeTableTab: (
        layerId: string,
        view: Object,
        editedLayers: Object[],
        featureType: string,
        addressField: string
    ) => void,
    view: Object,
    editedLayers: Object[],
    featureType: string,
    addressField: string,
};

function TabbedTableView({
    layers,
    activeTable,
    setActiveTable,
    activeAdmin,
    closeTableTab,
    view,
    editedLayers,
    featureType,
    addressField,
}: Props) {
    return (
        <>
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
                                    admin={activeAdmin === l.id.replace('_s', '')
                                || (l.parentLayer && activeAdmin === l.parentLayer.replace('_s', ''))}
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
                                        closeTableTab(
                                            l.id,
                                            view,
                                            editedLayers,
                                            featureType,
                                            addressField,
                                            l.type === 'agfl',
                                        );
                                    }}
                                    className="fas fa-times"
                                    admin={activeAdmin === l.id.replace('_s', '')
                                || (l.parentLayer && activeAdmin === l.parentLayer.replace('_s', ''))}
                                />
                            </ButtonWrapper>
                        ))
                    }
                </Scrollbars>
            </WrapperTabbedTable>
            <ReactTableContainer />
        </>
    );
}

export default TabbedTableView;
