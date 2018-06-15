import React from 'react';
import { shallow } from 'enzyme';
import TableView from '../TableView';
import ReactTableContainer from '../react-table/ReactTableContainer';
import Table from '../../../ui/blocks/Table';

const setup = () => {
    const props = {
        setToggleTable: () => {},
        toggleTable: false,
        activeNav: '',
    };
    const wrapper = shallow(<TableView />);

    return { props, wrapper };
};

describe('<TableView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(Table).length).toBe(1);
        expect(wrapper.find(Table.Link).length).toBe(1);
        expect(wrapper.find(ReactTableContainer).length).toBe(1);
    });
});
