import React from 'react';
import { shallow } from 'enzyme';
import CustomTableView from '../CustomTableView';

const setup = () => {
    const props = {
        children: [{}],
        className: '',
    };

    const wrapper = shallow(<CustomTableView {...props} />);

    return { wrapper };
};

describe('<ReactTable />', () => {
    it('should render self', () => {
        const { wrapper } = setup();

        expect(wrapper.exists()).toBe(true);
    });
});
