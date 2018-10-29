// @flow
import React, { Component } from 'react';
import strings from '../../../../translations';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ModalBufferSelectedView from './ModalBufferSelectedView';
import { setBuffer } from '../../../../utils/buffer';

type Props = {
    selectedGeometryData: Array<Object>,
    view: Object,
    setSingleLayerGeometry: Function,
};

type State = {
    bufferSize: number,
};

const initialState = {
    bufferSize: 0,
};

class ModalBufferSelected extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handleBufferChange = this.handleBufferChange.bind(this);
    }

    componentWillUnmount() {
        this.props.setSingleLayerGeometry({});
    }

    handleBufferChange = (e: Object) => {
        this.setState({ bufferSize: e.target.value });
    };

    render() {
        const { selectedGeometryData, view } = this.props;
        const { bufferSize } = this.state;

        const modalSubmit = [{
            text: strings.modalAddUserLayer.submit,
            handleSubmit: () => {
                setBuffer(
                    view,
                    selectedGeometryData,
                    bufferSize,
                );
            },
            disabled: false,
            toggleModal: true,
        }];

        return (
            <ModalContainer
                title={
                    selectedGeometryData.length <= 1 ?
                        strings.modalBufferSelectedData.singleTitle :
                        strings.modalBufferSelectedData.title
                }
                modalSubmit={modalSubmit}
                cancelText={strings.modalBufferSelectedData.cancel}
            >
                <ModalBufferSelectedView
                    handleBufferChange={this.handleBufferChange}
                />
            </ModalContainer>
        );
    }
}

export default ModalBufferSelected;
