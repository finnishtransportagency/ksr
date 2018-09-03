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
    handleTextChange: Function; // eslint-disable-line react/sort-comp
    handleModalSubmit: Function; // eslint-disable-line react/sort-comp
    handleModalCancel: Function; // eslint-disable-line react/sort-comp

    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleModalSubmit = this.handleModalSubmit.bind(this);
        this.handleModalCancel = this.handleModalCancel.bind(this);
    }

    handleTextChange(evt: any) {
        if (evt && evt.target && evt.target.value) {
            this.setState({
                text: evt.target.value.trim(),
            });
        }
    }

    handleModalSubmit() {
        this.props.setDrawText(this.state.text);
    }

    handleModalCancel() {
        this.props.setActiveTool('');
    }


    render() {
        return (
            <ModalContainer
                title={strings.modalDrawText.title}
                submitText={strings.modalDrawText.submitText}
                cancelText={strings.modalDrawText.cancelText}
                handleModalSubmit={this.handleModalSubmit}
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
