import React from 'react';
import { shallow } from 'enzyme';
import Table from '../../../../../ui/blocks/Table';
import ActiveLayerView from '../ActiveLayerView';

const setup = (prop) => {
    const minProps = {
        isOpen: false,
        setActiveModal: jest.fn(),
        originalLayers: [],
        geometryDataSelected: true,
        activeTableDataSelected: true,
        activeTableLayer: true,
    };

    const props = prop || minProps;
    const wrapper = shallow(<ActiveLayerView {...props} />);

    return { props, wrapper };
};

describe.skip('<ActiveLayerView />', () => {
    it('should render self', () => {
        const { wrapper } = setup();

        expect(wrapper.find(Table.Button).length).toBe(3);
    });
});
