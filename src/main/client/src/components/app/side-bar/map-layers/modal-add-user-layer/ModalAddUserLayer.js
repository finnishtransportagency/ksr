// @flow
import React, { Component } from 'react';
import { fetchAddUserLayer } from '../../../../../api/user-layer/addUserLayer';
import strings from '../../../../../translations';
import ModalContainer from '../../../shared/Modal/ModalContainer';
import ModalAddUserLayerView from './ModalAddUserLayerView';

type Props = {
    /* ... */
};

type State = {
    layerValues: Object,
    optionsType: Array<Object>,
};

const initialState = {
    layerValues: {
        name: '',
        type: '',
        url: '',
        layers: '',
        opacity: 1,
        minScale: 577790,
        maxScale: 9027,
        transparent: true,
        attribution: '',
        desktopVisible: true,
        mobileVisible: true,
        styles: '',
    },
    optionsType: [
        {
            value: 'agfs',
            label: 'ArcGIS Feature Service',
        },
        {
            value: 'wms',
            label: 'Web Map Service',
        },
        {
            value: 'wmts',
            label: 'Web Map Tile Service',
        },
        {
            value: 'wfs',
            label: 'Web Feature Service',
        },
        {
            value: 'mvt',
            label: 'Mapnik Vector Tile',
        },
    ],
};

class ModalAddUserLayer extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleOpacityChange = this.handleOpacityChange.bind(this);
    }

    handleInputChange = (evt: Object) => {
        this.setState({
            layerValues: { ...this.state.layerValues, [evt.target.name]: evt.target.value },
        });
    };

    handleTypeChange = (type: String) => {
        const { layerValues } = this.state;
        this.setState({
            layerValues: {
                ...layerValues,
                type,
            },
        });
    };

    handleCheckboxChange = (name: String) => {
        const { layerValues } = this.state;
        this.setState({
            layerValues: {
                ...layerValues,
                [name]: !layerValues[name],
            },
        });
    };

    handleOpacityChange = (evt: Object) => {
        const { layerValues } = this.state;
        this.setState({
            layerValues: {
                ...layerValues,
                opacity: evt,
            },
        });
    };

    handleSubmit = () => {
        const { layerValues } = this.state;
        fetchAddUserLayer(layerValues);
    };

    render() {
        const { layerValues, optionsType } = this.state;

        return (
            <ModalContainer
                title={strings.modalAddUserLayer.title}
                handleModalSubmit={this.handleSubmit}
                submitText={strings.modalAddUserLayer.submit}
                cancelText={strings.modalAddUserLayer.cancel}
            >
                <ModalAddUserLayerView
                    handleInputChange={this.handleInputChange}
                    handleTypeChange={this.handleTypeChange}
                    handleCheckboxChange={this.handleCheckboxChange}
                    handleOpacityChange={this.handleOpacityChange}
                    layerValues={layerValues}
                    optionsType={optionsType}
                />
            </ModalContainer>
        );
    }
}

export default ModalAddUserLayer;
