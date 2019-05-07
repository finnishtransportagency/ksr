import React from 'react';
import { shallow } from 'enzyme';
import TableView from '../TableView';
import TabbedTableContainer from '../tabbed-table/TabbedTableContainer';
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

describe('<TableView />', () => {
    it('should render self', () => {
        const { wrapper } = setup();

        expect(wrapper.find(Table).length).toBe(1);
        expect(wrapper.find(Table.Button).length).toBe(6);
        expect(wrapper.find(TabbedTableContainer).length).toBe(1);
    });

    it('should render view with more Buttons available', () => {
        const props = {
            toggleTable: false,
            isOpen: false,
            activeNav: '',
            setActiveModal: jest.fn(),
            activeUpdate: true,
            activeDelete: true,
            originalLayers: [],
            editedLayers: [],
            selectedData: false,
            activeAdminTool: '1',
        };

        const { wrapper } = setup(props);
        expect(wrapper.find(Table.Button).length).toBe(8);
    });
});
