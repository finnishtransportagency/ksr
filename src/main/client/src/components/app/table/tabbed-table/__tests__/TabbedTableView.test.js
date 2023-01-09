import React from 'react';
import { shallow } from 'enzyme';
import TabbedTableView from '../TabbedTableView';
import { WrapperTabbedTable, ButtonTabbedTableTab, ButtonIcon } from '../styles';

const setup = () => {
    const props = {
        layers: [
            {
                id: '1',
                title: 'Layer 1',
            },
            {
                id: '6',
                title: 'Layer 6',
            },
            {
                id: '10',
                title: 'Layer 10',
            },
        ],
        activeTable: '6',
        setActiveTable: jest.fn(),
        showConfirmModal: jest.fn(),
        deactivateLayer: jest.fn(),
        closeTableTab: jest.fn(),
        closeTab: jest.fn(),
    };

    const wrapper = shallow(<TabbedTableView {...props} />);

    return { props, wrapper };
};

describe.skip('<TabbedTableView />', () => {
    const { props, wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('contains <WrapperTabbedTable />', () => {
        expect(wrapper.find(WrapperTabbedTable).length).toBe(1);
    });

    it('contains correct amount of <ButtonTabbedTableTab />', () => {
        expect(wrapper.find(ButtonTabbedTableTab).length).toBe(props.layers.length);
    });

    it('<ButtonTabbedTableTab /> fires a click', () => {
        const button = wrapper.find(ButtonTabbedTableTab).at(0);
        button.simulate('click');
        expect(props.setActiveTable.mock.calls.length).toBe(1);
    });

    it('contains correct amount of <ButtonIcon />', () => {
        expect(wrapper.find(ButtonIcon).length).toBe(props.layers.length);
    });

    it('<ButtonIcon /> fires a click', () => {
        const button = wrapper.find(ButtonIcon).at(0);
        button.simulate('click');
        expect(props.deactivateLayer.mock.calls.length).toBe(0);
    });
});
