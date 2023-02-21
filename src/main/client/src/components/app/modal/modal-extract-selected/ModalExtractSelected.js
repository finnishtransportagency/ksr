// @flow
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import strings from '../../../../translations';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ModalExtractSelectedView from './ModalExtractSelectedView';
import { extractSelected } from '../../../../utils/extract';

type Props = {
    layerId: string,
    selectedGeometryData: Array<Object>,
    extractServiceUrl: string,
};

type State = {
    extracting: boolean,
    activeFormat: string,
    downloadFormat: string,
    outputLink: string,
};

const initialState = {
    extracting: false,
    activeFormat: 'Shapefile - SHP - .shp',
    downloadFormat: '',
    outputLink: '',
};

class ModalExtractSelected extends Component<Props, State> {
    modalOpen: boolean = true;

    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleModalSubmit = this.handleModalSubmit.bind(this);
    }

    componentWillUnmount() {
        this.modalOpen = false;
    }

    handleRadioChange: any = (evt: Object) => {
        this.setState({ activeFormat: evt.target.value });
    };

    handleModalSubmit: any = () => {
        const { layerId, extractServiceUrl, selectedGeometryData } = this.props;
        const { activeFormat } = this.state;

        this.setState({
            extracting: true,
            outputLink: '',
            downloadFormat: activeFormat.slice(-4),
        });
        extractSelected(
            extractServiceUrl,
            layerId,
            selectedGeometryData,
            activeFormat,
        )
            .then((outputLink) => {
                if (this.modalOpen) {
                    this.setState({
                        extracting: false,
                        outputLink,
                    });
                }
            })
            .catch(() => {
                if (this.modalOpen) {
                    this.setState({
                        extracting: false,
                        outputLink: '',
                    });
                    toast.error(strings.modalExtractSelectedData.outputError);
                }
            });
    };

    render(): React$Element<any> {
        const {
            extracting,
            activeFormat,
            downloadFormat,
            outputLink,
        } = this.state;
        const modalSubmit = [{
            text: strings.modalExtractSelectedData.submit,
            handleSubmit: this.handleModalSubmit,
            disabled: extracting,
            toggleModal: false,
        }];

        return (
            <ModalContainer
                title={strings.modalExtractSelectedData.title}
                modalSubmit={modalSubmit}
                cancelText={strings.modalExtractSelectedData.cancel}
            >
                <ModalExtractSelectedView
                    activeFormat={activeFormat}
                    downloadFormat={downloadFormat}
                    handleRadioChange={this.handleRadioChange}
                    outputLink={outputLink}
                    extracting={extracting}
                />
            </ModalContainer>
        );
    }
}

export default ModalExtractSelected;
