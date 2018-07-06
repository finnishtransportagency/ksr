import React from 'react';
import { shallow } from 'enzyme';
import CustomTableBodyView from '../CustomTableBodyView';
import CustomTableBodyWrapper from '../styles';

const setup = (prop) => {
    const minProps = {
        children: '<div/>',
    };

    const props = prop || minProps;
    const wrapper = shallow(<CustomTableBodyView {...props} />);

    return { minProps, wrapper };
};

describe('<CustomTableView />', () => {
    it('should render self', () => {
        const { wrapper } = setup();

        expect(wrapper.find(CustomTableBodyWrapper).exists()).toBe(true);
    });
});
