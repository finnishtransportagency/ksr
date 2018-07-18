import React from 'react';
import { shallow } from 'enzyme';
import TableView from '../TableView';
import TabbedTableContainer from '../tabbed-table/TabbedTableContainer';
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
        expect(wrapper.find(Table.Button).length).toBe(2);
        expect(wrapper.find(TabbedTableContainer).length).toBe(1);
    });
});
