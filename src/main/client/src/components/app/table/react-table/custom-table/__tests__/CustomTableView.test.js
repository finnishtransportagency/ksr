import React from 'react';
import { shallow } from 'enzyme';
import CustomTableView from '../CustomTableView';
import CustomTableWrapper from '../styles';

const setup = (prop) => {
    const minProps = {
        children: {},
        className: '',
    };

    const props = prop || minProps;
    const wrapper = shallow(<CustomTableView {...props} />);

    return { minProps, wrapper };
};

describe('<ReactTable />', () => {
    it('should render self', () => {
        const { wrapper } = setup();

        expect(wrapper.find(CustomTableWrapper).exists()).toBe(true);
    });
});
