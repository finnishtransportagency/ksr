import React from 'react';
import { shallow } from 'enzyme';
import ModalContainer from '../../../shared/Modal/ModalContainer';
import ModalFilter from '../ModalFilter';
import ModalFilterView from '../ModalFilterView';

const setup = (prop) => {
    const minProps = {
        columns: [
            {
                Header: 'ObjectID',
                show: false,
            },
            {
                Header: 'Name',
                show: false,
            },
        ],
        handleOnChange: jest.fn(),
    };
    const props = prop || minProps;
    const wrapper = shallow(<ModalFilter {...props} />);

    return { props, wrapper };
};

describe.skip('<ModalFilter />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('contains <ModalContainer />', () => {
        expect(wrapper.find(ModalContainer).length).toBe(1);
    });

    it('should contain view', () => {
        expect(wrapper.find(ModalFilterView).length).toBe(1);
    });

    it('should load columns', () => {
        const spyLoadColumns = jest.spyOn(wrapper.instance(), 'loadColumns');
        wrapper.instance().componentDidMount();

        expect(spyLoadColumns).toHaveBeenCalled();
    });

    it('should set correct state when loadColumns invoked', () => {
        const { columns } = wrapper.instance().props;

        wrapper.setState({ columns: [] });
        expect(wrapper.state('columns')).toEqual([]);

        wrapper.instance().loadColumns();
        expect(wrapper.state('columns')).toEqual(columns);
    });

    it('should set correct state when handleOnChange invoked', () => {
        expect(wrapper.state('columns').find((obj => obj.Header === 'Name'))).toEqual({
            Header: 'Name',
            show: false,
        });

        wrapper.instance().loadColumns();
        wrapper.instance().handleOnChange('Name');

        expect(wrapper.state('columns').find((obj => obj.Header === 'Name'))).toEqual({
            Header: 'Name',
            show: true,
        });
    });
});
