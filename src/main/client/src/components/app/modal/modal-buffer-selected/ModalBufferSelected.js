// @flow
import React, { Component } from 'react';
import strings from '../../../../translations';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ModalBufferSelectedView from './ModalBufferSelectedView';
import { setBuffer } from '../../../../utils/buffer';

type Props = {
    tableGeometryData: Object[],
    selectedGeometryData: Object[],
    view: Object,
    setSingleLayerGeometry: Function,
    activeLayerId: string,
};

type State = {
    bufferSize: number,
    submitDisabled: boolean,
    currentTableOnly: boolean,
    selectedFeaturesOnly: boolean,
};

const initialState = {
    bufferSize: 0,
    submitDisabled: true,
    currentTableOnly: false,
    selectedFeaturesOnly: false,
};

class ModalBufferSelected extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handleBufferChange = this.handleBufferChange.bind(this);
        this.handleTableSelectionChange = this.handleTableSelectionChange.bind(this);
        this.handleFeatureSelectionChange = this.handleFeatureSelectionChange.bind(this);
    }

    componentWillUnmount() {
        const { setSingleLayerGeometry } = this.props;

        setSingleLayerGeometry({});
    }

    handleBufferChange = (e: Object) => {
        const submitDisabled = e.target.value === ''
            || e.target.value < 1
            || e.target.value > 100000;

        this.setState({
            bufferSize: e.target.value,
            submitDisabled,
        });
    };

    handleTableSelectionChange = () => {
        const { currentTableOnly } = this.state;

        this.setState({ currentTableOnly: !currentTableOnly });
    };

    handleFeatureSelectionChange = () => {
        const { selectedFeaturesOnly } = this.state;

        this.setState({ selectedFeaturesOnly: !selectedFeaturesOnly });
    };

    render() {
        const {
            selectedGeometryData, view, activeLayerId, tableGeometryData,
        } = this.props;

        const {
            bufferSize,
            submitDisabled,
            currentTableOnly,
            selectedFeaturesOnly,
        } = this.state;

        const modalSubmit = [{
            text: strings.modalAddUserLayer.submit,
            handleSubmit: () => {
                setBuffer(
                    view,
                    selectedGeometryData,
                    tableGeometryData,
                    bufferSize,
                    currentTableOnly,
                    selectedFeaturesOnly,
                    activeLayerId,
                );
            },
            disabled: submitDisabled,
            toggleModal: true,
        }];

        return (
            <ModalContainer
                title={strings.modalBufferSelectedData.title}
                modalSubmit={modalSubmit}
                cancelText={strings.modalBufferSelectedData.cancel}
            >
                <ModalBufferSelectedView
                    currentTableOnly={currentTableOnly}
                    selectedFeaturesOnly={selectedFeaturesOnly}
                    handleBufferChange={this.handleBufferChange}
                    handleTableSelectionChange={this.handleTableSelectionChange}
                    handleFeatureSelectionChange={this.handleFeatureSelectionChange}
                />
            </ModalContainer>
        );
    }
}

export default ModalBufferSelected;
