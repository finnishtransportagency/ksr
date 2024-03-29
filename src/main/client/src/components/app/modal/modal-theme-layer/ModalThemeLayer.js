// @flow
import React, { Component } from 'react';
import strings from '../../../../translations/fi';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ModalThemeLayerView from './ModalThemeLayerView';
import { createThemeLayer, resetLayerTheme } from '../../../../utils/theme-layer/createThemeLayer';
import { themeLayerFields } from '../../../../utils/fields';

type Props = {
    view: Object,
    layerId: string,
    layerLegendActive: boolean,
    toggleLayerLegend: () => void,
    layerList: Object[],
    setLayerList: (Object[]) => void,
};

type State = {
    submitDisabled: boolean,
    fetching: boolean,
    selectedField: string,
    selectedClassification: string,
    numClasses: number,
    invalidNumber: boolean,
};

const initialState = {
    submitDisabled: true,
    fetching: false,
    selectedField: '',
    selectedClassification: 'equal-interval',
    numClasses: 5,
    invalidNumber: false,
};

class ModalThemeLayer extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleClassificationChange = this.handleClassificationChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handleFieldChange: any = (selectedField: string) => {
        this.setState({ selectedField });
    };

    handleClassificationChange: any = (event: Object) => {
        this.setState({ selectedClassification: event.target.value });
    };

    handleInputChange: any = (evt: Object) => {
        this.setState({ numClasses: evt.target.value });
        if (evt.target.value < 1 || evt.target.value > 10) {
            this.setState({ invalidNumber: true });
        } else {
            this.setState({ invalidNumber: false });
        }
    };

    handleSubmit: any = async () => {
        const { layerId, view } = this.props;
        const fl = view.map.findLayerById(layerId);

        if (fl) {
            const {
                selectedField,
                selectedClassification,
                numClasses,
            } = this.state;
            const {
                layerLegendActive,
                toggleLayerLegend,
                layerList,
                setLayerList,
            } = this.props;

            const rendererParams = {
                layer: fl,
                field: selectedField,
                classificationMethod: selectedClassification,
                numClasses,
            };

            await createThemeLayer(
                fl,
                rendererParams,
                layerId,
                layerList,
                setLayerList,
            );
            const layerVisible = layerList.find(layer => layer.id === layerId)?.visible;
            if (!layerLegendActive && layerVisible) toggleLayerLegend();
        }
    };

    handleReset: any = () => {
        const {
            layerId,
            view,
            layerList,
            setLayerList,
            layerLegendActive,
        } = this.props;
        const fl = view.map.findLayerById(layerId);
        const layer = layerList.find(l => l.id === layerId);
        if (fl && layer && layer.renderer) {
            resetLayerTheme(fl, layer, layerList, setLayerList, layerLegendActive);
        }
    };

    render(): any {
        const {
            submitDisabled,
            fetching,
            selectedField,
            selectedClassification,
            numClasses,
            invalidNumber,
        } = this.state;

        const { layerId, layerList } = this.props;
        const layer = layerList.find(l => l.id === layerId);

        const modalSubmit = [
            {
                text: strings.modalThemeLayer.submit,
                handleSubmit: this.handleSubmit,
                disabled: !selectedField || !numClasses || invalidNumber,
                toggleModal: true,
            },
            {
                text: strings.modalThemeLayer.reset,
                handleSubmit: this.handleReset,
                disabled: !layer || !layer.renderer,
                toggleModal: false,
            },
        ];

        const fields = themeLayerFields(layer);

        return (
            <ModalContainer
                title={strings.modalThemeLayer.title}
                modalSubmit={modalSubmit}
                cancelText={strings.modalThemeLayer.cancel}
            >
                <ModalThemeLayerView
                    handleFieldChange={this.handleFieldChange}
                    handleClassificationChange={this.handleClassificationChange}
                    handleInputChange={this.handleInputChange}
                    selectedField={selectedField}
                    selectedClassification={selectedClassification}
                    numClasses={numClasses}
                    submitDisabled={submitDisabled}
                    fetching={fetching}
                    layerFields={fields}
                />
            </ModalContainer>
        );
    }
}

export default ModalThemeLayer;
