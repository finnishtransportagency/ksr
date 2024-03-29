// @flow
import React, { Component } from 'react';
import strings from '../../../../translations';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ModalBufferSelectedView from './ModalBufferSelectedView';
import { setBuffer, setSingleFeatureBuffer } from '../../../../utils/buffer';

type Props = {
    tableGeometryData: Object[],
    selectedGeometryData: Object[],
    view: Object,
    setSingleLayerGeometry: Function,
    activeLayerId: string,
    singleFeature: boolean,
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

    handleBufferChange: any = (e: Object) => {
        const submitDisabled = e.target.value === ''
            || e.target.value < 1
            || e.target.value > 100000;

        this.setState({
            bufferSize: e.target.value,
            submitDisabled,
        });
    };

    handleTableSelectionChange: any = () => {
        const { currentTableOnly } = this.state;

        this.setState({ currentTableOnly: !currentTableOnly });
    };

    handleFeatureSelectionChange: any = () => {
        const { selectedFeaturesOnly } = this.state;

        this.setState({ selectedFeaturesOnly: !selectedFeaturesOnly });
    };

    render(): React$Element<any> {
        const {
            selectedGeometryData, view, activeLayerId, tableGeometryData, singleFeature,
        } = this.props;

        const {
            bufferSize,
            submitDisabled,
            currentTableOnly,
            selectedFeaturesOnly,
        } = this.state;

        const targetedFeatures = selectedFeaturesOnly
            ? selectedGeometryData
            : tableGeometryData;

        const selectedAmount = currentTableOnly
            ? targetedFeatures
                .filter(data => data.layerId === activeLayerId)
                .map(data => data.geometry).length
            : targetedFeatures.length;

        const modalSubmit = [{
            text: strings.modalAddUserLayer.submit,
            handleSubmit: async () => {
                if (singleFeature) {
                    view.graphics.removeMany(view.graphics.filter(g => g && g.id === 'buffer'));
                    setSingleFeatureBuffer(
                        view,
                        selectedGeometryData,
                        bufferSize,
                    );
                } else {
                    await new Promise(resolve => setTimeout(resolve, 300));
                    await setBuffer(
                        view,
                        selectedGeometryData,
                        tableGeometryData,
                        bufferSize,
                        currentTableOnly,
                        selectedFeaturesOnly,
                        activeLayerId,
                    );
                }
            },
            disabled: submitDisabled || selectedAmount > 1000,
            toggleModal: true,
        }];

        return (
            <ModalContainer
                title={singleFeature
                    ? strings.modalBufferSelectedData.titleSingleFeature
                    : strings.modalBufferSelectedData.title}
                modalSubmit={modalSubmit}
                cancelText={strings.modalBufferSelectedData.cancel}
            >
                <ModalBufferSelectedView
                    currentTableOnly={currentTableOnly}
                    selectedFeaturesOnly={selectedFeaturesOnly}
                    handleBufferChange={this.handleBufferChange}
                    handleTableSelectionChange={this.handleTableSelectionChange}
                    handleFeatureSelectionChange={this.handleFeatureSelectionChange}
                    singleFeature={singleFeature}
                />
                {selectedAmount > 1000 && (
                    <p>{`${strings.modalBufferSelectedData.targetedFeaturesTotal} ${selectedAmount}. ${strings.modalBufferSelectedData.targetedFeaturesLimit}`}</p>
                )}
            </ModalContainer>
        );
    }
}

export default ModalBufferSelected;
