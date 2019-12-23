// @flow
import React, { Component } from 'react';
import strings from '../../../../translations';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ModalFilterView from './ModalFilterView';

type Props = {
    columns: any,
    setColumns: (data: Array<Object>) => void,
};

type State = {
    columns: any,
};

const initialState = {
    columns: [],
};

class ModalFilter extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { ...initialState };

        this.handleOnChange = this.handleOnChange.bind(this);
    }

    componentDidMount() {
        this.loadColumns();
    }

    loadColumns = () => {
        const { columns } = this.props;
        this.setState({ columns: columns.map(c => ({ ...c })) });
    };

    handleOnChange = (name: string) => {
        const { columns } = this.state;
        const newColumns = columns.map(c => ({
            ...c,
            show: c.Header === name ? !c.show : c.show,
        }));
        this.setState({ columns: newColumns });
    };

    render() {
        const { columns } = this.state;
        const { setColumns } = this.props;

        const modalSubmit = [{
            text: strings.modalFilter.submit,
            handleSubmit: () => {
                setColumns(columns);
            },
            disabled: columns.every(c => c.show === false),
            toggleModal: true,
        },
        {
            text: columns.every(c => c.show === true)
                ? strings.modalFilter.selectNone
                : strings.modalFilter.selectAll,
            handleSubmit: () => {
                const cols = columns.every(c => c.show === true)
                    ? columns.map(c => ({
                        ...c,
                        show: false,
                    }))
                    : columns.map(c => ({
                        ...c,
                        show: true,
                    }));
                this.setState({ columns: cols });
            },
            disabled: false,
            toggleModal: false,
        },
        ];

        return (
            <ModalContainer
                title={strings.modalFilter.title}
                modalSubmit={modalSubmit}
                cancelText={strings.modalFilter.cancel}
                columns={columns}
            >
                <ModalFilterView
                    columns={columns}
                    handleOnChange={this.handleOnChange}
                />
            </ModalContainer>
        );
    }
}

export default ModalFilter;
