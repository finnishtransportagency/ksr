// @flow
import React, { Component } from 'react';
import strings from '../../../../translations';
import Checkbox from '../../../ui/blocks/Checkbox';
import ModalContainer from '../../shared/Modal/ModalContainer';
import { ModalFilterWrapper, CheckboxWrapper } from './styles';

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

    handleOnChange = (name: any) => {
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
                <ModalFilterWrapper>
                    {
                        columns.map(c => (
                            <CheckboxWrapper key={c.Header}>
                                <Checkbox className="content-checkbox" htmlFor={c.Header}>
                                    <p title={c.Header}>{c.Header}</p>
                                    <Checkbox.Input
                                        id={c.Header}
                                        name={c.Header}
                                        type="checkbox"
                                        checked={c.show}
                                        onChange={() => {
                                            this.handleOnChange(c.Header);
                                        }}
                                    />
                                    <Checkbox.Checkmark />
                                </Checkbox>
                            </CheckboxWrapper>
                        ))
                    }
                </ModalFilterWrapper>
            </ModalContainer>
        );
    }
}

export default ModalFilter;
