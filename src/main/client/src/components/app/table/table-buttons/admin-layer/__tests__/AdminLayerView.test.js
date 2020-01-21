import React from 'react';
import { shallow } from 'enzyme';
import Table from '../../../../../ui/blocks/Table';
import AdminLayerView from '../AdminLayerView';

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
    const wrapper = shallow(<AdminLayerView {...props} />);

    return { props, wrapper };
};

describe('<AdminLayerView />', () => {
    it('should render self', () => {
        const { wrapper } = setup();

        expect(wrapper.find(Table.Button).length).toBe(2);
    });
});
