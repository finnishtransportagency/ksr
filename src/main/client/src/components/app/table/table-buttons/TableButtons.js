// @flow
import React, { useEffect, useState } from 'react';
import TableButtonsView from './TableButtonsView';

type Props = {
    toggleTable: Function,
    isOpen: boolean,
    setActiveModal: (modal: string) => void,
    activeDelete: boolean,
    originalLayers: Array<Object>,
    editedLayers: Array<Object>,
    selectedAdminData: boolean,
    geometryDataSelected: boolean,
    geometryData: Object[],
    activeTableDataSelected: boolean,
    activeTableLayer: Object,
    showConfirmModal: (
        body: string,
        acceptText: string,
        cancelText: string,
        accept: Function
    ) => void,
    clearTableData: Function,
    saveEditedFeatures: Function,
    featureType: string,
    addressField: string,
    view: Object,
    activeAdminTool: string,
    currentTabAdmin: boolean,
    setButtonAmount: (buttonAmount: ?number) => void,
    viewGraphics: Object[],
    hasTableEdited: boolean,
    togglePortal: Function,
    portalIsOpen: boolean,
    updatePortal: Function,
    layerList: Object[],
};

function TableButtons(props: Props): React$Element<any> {
    const [bufferExists, setBufferExists] = useState(false);

    /** Update redux prop that keeps track of amount typeflowErrorPropsf */
    useEffect(() => {
        const tableButtonWrapper = document.getElementById('table-button--wrapper');
        const tableButtonAmount = tableButtonWrapper !== null
            ? tableButtonWrapper.childNodes.length
            : null;

        props.setButtonAmount(tableButtonAmount);
    }, [props.currentTabAdmin]);

    /** Set buffer as existing, if buffer added to the view */
    useEffect(() => {
        setBufferExists(props.viewGraphics.some(graphic => graphic && graphic.id === 'buffer'));
    }, [props.viewGraphics.length]);

    /** Remove buffer, if no layers open on table */
    useEffect(() => {
        if (props.view && props.originalLayers && props.originalLayers.length === 0) {
            props.view.graphics.removeMany(props.view.graphics.filter(g => g && g.id === 'buffer'));
            setBufferExists(false);
        }
    }, [props.originalLayers]);

    /** Remove buffer graphics from the view */
    const handleClearBuffer: Function = () => {
        props.view.graphics.removeMany(props.view.graphics.filter(g => g && g.id === 'buffer'));
        setBufferExists(false);
    };

    return (
        <TableButtonsView {...props} bufferExists={bufferExists} handleClearBuffer={handleClearBuffer} />
    );
}

export default TableButtons;
