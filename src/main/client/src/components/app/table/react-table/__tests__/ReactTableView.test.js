import React from 'react';
import { shallow } from 'enzyme';
import ReactTableView from '../ReactTableView';
import { WrapperReactTable } from '../styles';

const setup = () => {
    const props = {
        data: [],
        columns: [],
    };
    const wrapper = shallow(<ReactTableView {...props} />);

    return { props, wrapper };
};

describe('<ReactTableView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(WrapperReactTable).length).toBe(1);
    });
});
