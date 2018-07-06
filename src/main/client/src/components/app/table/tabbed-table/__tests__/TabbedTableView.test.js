import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import TabbedTableView from '../TabbedTableView';
import { WrapperTabbedTable, ButtonTabbedTableTab } from '../styles';

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
        setActiveTable: sinon.spy(),
    };

    const wrapper = shallow(<TabbedTableView {...props} />);

    return { props, wrapper };
};

describe('<TabbedTableView />', () => {
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
        expect(props.setActiveTable.calledOnce).toBe(true);
    });
});