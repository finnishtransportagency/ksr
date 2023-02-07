// @flow
import React from 'react';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ModalDrawTextView from './ModalDrawTextView';
import strings from '../../../../translations';

type Props = {
    setDrawText: Function,
    setActiveTool: Function,
};

type State = {
    text: ?string,
}

const initialState: State = {
    text: '',
};

class ModalDrawText extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleModalSubmit = this.handleModalSubmit.bind(this);
        this.handleModalCancel = this.handleModalCancel.bind(this);
    }

    handleTextChange: any = (evt: any) => {
        if (evt && evt.target && evt.target.value) {
            this.setState({
                text: evt.target.value.trim(),
            });
        }
    };

    handleModalSubmit: any = () => {
        this.props.setDrawText(this.state.text);
    };

    handleModalCancel: any = () => {
        this.props.setActiveTool('');
    };

    render(): React$Element<any> {
        const { text } = this.state;
        const modalSubmit = [{
            text: strings.modalDrawText.submitText,
            handleSubmit: this.handleModalSubmit,
            disabled: !text,
            toggleModal: true,
        }];

        return (
            <ModalContainer
                title={strings.modalDrawText.title}
                modalSubmit={modalSubmit}
                cancelText={strings.modalDrawText.cancelText}
                handleModalCancel={this.handleModalCancel}
            >
                <ModalDrawTextView
                    handleTextChange={this.handleTextChange}
                />
            </ModalContainer>
        );
    }
}

export default ModalDrawText;
