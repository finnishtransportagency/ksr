// @flow
import React, { Component } from 'react';
import ModalLayerDetailsView from './ModalLayerDetailsView';
import strings from '../../../../translations';
import { saveNewFeatureData } from '../../../../utils/saveNewFeatureData';
import ModalContainer from '../../shared/Modal/ModalContainer';
import { parseGeometryType } from '../../../../utils/type';

type Props = {
    fields: any,
    layer: Object,
    setTempGrapLayer: Function,
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

        this.handleOnChange = this.handleOnChange.bind(this);
    }

    componentDidMount() {
        this.loadFields();
    }

    componentWillUnmount() {
        const { layer } = this.props;
        layer.graphics = undefined;
        this.props.setTempGrapLayer(layer);
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

    handleOnChange = (field: Object, event: Object) => {
        const newData = Object.assign({}, this.state.data);
        newData.attributes[event.target.name] = event.target.value;
        this.setState({ data: newData });
    };

    render() {
        const { fields } = this.props;
        const { data } = this.state;

        return (
            <ModalContainer
                title={strings.modalLayerDetails.title}
                handleModalSubmit={() => saveNewFeatureData(data)}
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
