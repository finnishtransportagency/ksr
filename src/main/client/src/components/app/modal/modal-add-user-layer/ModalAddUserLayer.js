// @flow
import React, { Component } from 'react';
import strings from '../../../../translations';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ModalAddUserLayerView from './ModalAddUserLayerView';

type Props = {
    addUserLayer: (layerValues: Object) => void,
};

type State = {
    layerValues: Object,
    optionsType: Array<Object>,
};

const initialState = {
    layerValues: {
        name: '',
        type: 'agfs',
        url: '',
        layers: '',
        opacity: 1,
        minScale: 0,
        maxScale: 0,
        transparent: true,
        attribution: '',
        desktopVisible: true,
        mobileVisible: true,
        styles: '',
        queryable: '0',
        queryColumns: '',
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

    handleTypeChange = (type: string) => {
        const { layerValues } = this.state;
        this.setState({
            layerValues: {
                ...layerValues,
                type,
            },
        });
    };

    handleCheckboxChange = (name: string) => {
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
        const { addUserLayer } = this.props;
        const layerValues = { ...this.state.layerValues };

        layerValues.desktopVisible = layerValues.desktopVisible ? '1' : '0';
        layerValues.mobileVisible = layerValues.mobileVisible ? '1' : '0';
        layerValues.queryColumns = layerValues.queryColumns === ''
            ? null
            : layerValues.queryColumns.trim().split(',');

        if (Array.isArray(layerValues.queryColumns)) {
            layerValues.queryColumns = layerValues.queryColumns.map(c => c.trim());
        }
        layerValues.queryable = layerValues.queryColumns ? '1' : '0';

        if (layerValues.type === 'agfs') {
            layerValues.layers = '';
        } else {
            layerValues.queryColumns = null;
            layerValues.queryable = '0';
        }

        addUserLayer(layerValues);
    };

    render() {
        const { layerValues, optionsType } = this.state;

        const disabled = layerValues.type !== 'agfs'
            ? layerValues.name.length > 0 && layerValues.url.length > 0
            && layerValues.layers.length > 0
            : layerValues.name.length > 0 && layerValues.url.length > 0;

        const modalSubmit = [{
            text: strings.modalAddUserLayer.submit,
            handleSubmit: this.handleSubmit,
            disabled: !disabled,
            toggleModal: true,
        }];

        return (
            <ModalContainer
                title={strings.modalAddUserLayer.title}
                modalSubmit={modalSubmit}
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
