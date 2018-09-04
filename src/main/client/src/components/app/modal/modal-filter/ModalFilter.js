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
        const columns = [...this.state.columns];
        const column = columns.find((obj => obj.Header === name));
        column.show = !column.show;
        this.setState({ columns });
    };

    render() {
        const { columns } = this.state;
        const { setColumns } = this.props;

        return (
            <ModalContainer
                title={strings.modalFilter.title}
                handleModalSubmit={() => setColumns(columns)}
                submitText={strings.modalFilter.submit}
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
