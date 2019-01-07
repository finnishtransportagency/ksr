import React from 'react';
import { shallow } from 'enzyme';
import ModalContainer from '../../../shared/Modal/ModalContainer';
import ModalThemeLayer from '../ModalThemeLayer';
import ModalThemeLayerView from '../ModalThemeLayerView';

const setup = (prop) => {
    const minProps = {
        view: {},
        layerId: '',
        layerLegendActive: false,
        toggleLayerLegend: jest.fn(),
        layerList: [{}],
        setLayerList: jest.fn(),
    };

    const props = prop || minProps;
    const wrapper = shallow(<ModalThemeLayer {...props} />);

    return { props, wrapper };
};

describe('<ModalThemeLayer />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('contains <ModalContainer />', () => {
        expect(wrapper.find(ModalContainer).length).toBe(1);
    });
    it('contains <ModalThemeLayerView />', () => {
        expect(wrapper.find(ModalThemeLayerView).length).toBe(1);
    });
});
