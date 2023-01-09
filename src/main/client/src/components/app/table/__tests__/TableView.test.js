import React from 'react';
import { shallow } from 'enzyme';
import TableView from '../TableView';
import TabbedTableContainer from '../tabbed-table/TabbedTableContainer';
import TableButtonsContainer from '../table-buttons/TableButtonsContainer';
import Table from '../../../ui/blocks/Table';

const setup = (prop) => {
    const minProps = {
        toggleTable: false,
        isOpen: false,
        activeNav: '',
        setActiveModal: jest.fn(),
        activeUpdate: false,
        activeDelete: false,
        originalLayers: [],
        editedLayers: [],
        selectedData: false,
        activeAdminTool: '',
    };
    const props = prop || minProps;
    const wrapper = shallow(<TableView {...props} />);

    return { props, wrapper };
};

describe.skip('<TableView />', () => {
    it('should render self', () => {
        const { wrapper } = setup();

        expect(wrapper.find(Table).length).toBe(1);
        expect(wrapper.find(TabbedTableContainer).length).toBe(1);
        expect(wrapper.find(TableButtonsContainer).length).toBe(1);
    });
});
