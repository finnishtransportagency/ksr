// @flow
import React, { Component } from 'react';
import { createAddressFields } from '../../../../utils/geoconvert/createAddressFields';
import ModalLayerDetailsView from './ModalLayerDetailsView';
import strings from '../../../../translations';
import save from '../../../../utils/saveFeatureData';
import ModalContainer from '../../shared/Modal/ModalContainer';
import { parseGeometryType } from '../../../../utils/type';

type Props = {
    fields: any,
    layer: Object,
    setTempGraphicsLayer: Function,
    originalLayerId: string,
    view: Object,
    addressField: string,
    featureType: string,
};

type State = {
    data: Object,
};

const initialState = {
    data: {},
};

class ModalFilter extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { ...initialState };
    }

    componentDidMount() {
        this.loadFields();
    }

    componentWillUnmount() {
        const { layer } = this.props;
        layer.graphics = undefined;
        this.props.setTempGraphicsLayer(layer);
    }

    loadFields = () => {
        const { fields, layer } = this.props;
        const data = {};
        data.attributes = {};

        data.geometry = parseGeometryType(layer.graphics.items[0].geometry);
        fields.forEach((f) => {
            data.attributes[f.name] = '';
        });
        this.setState({ data });
    };

    handleOnChange = (event: Object) => {
        const data = Object.assign({}, this.state.data);
        data.attributes[event.target.name] = event.target.value;
        this.setState({ data });
    };

    handleModalSubmit = () => {
        const {
            layer,
            addressField,
            view,
            originalLayerId,
            featureType,
        } = this.props;
        const { data } = this.state;
        const geometryType = layer.graphics.items[0].geometry.type;

        createAddressFields(data, geometryType, featureType, addressField)
            .then(r => save.saveData('add', view, originalLayerId, [r]));
    };

    render() {
        const { fields } = this.props;

        return (
            <ModalContainer
                title={strings.modalLayerDetails.title}
                handleModalSubmit={this.handleModalSubmit}
                submitText={strings.modalLayerDetails.submit}
                cancelText={strings.modalLayerDetails.cancel}
            >
                <ModalLayerDetailsView
                    fields={fields}
                    handleOnChange={this.handleOnChange}
                />
            </ModalContainer>
        );
    }
}

export default ModalFilter;
