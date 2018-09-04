import React from 'react';
import { shallow } from 'enzyme';
import ModalLayerDetails from '../ModalLayerDetails';
import ModalLayerDetailsView from '../ModalLayerDetailsView';

const setup = () => {
    const props = {
        fields: [],
        layer: { graphics: { items: [{ geometry: [10, 10] }] } },
        setTempGrapLayer: jest.fn(),
    };
    const wrapper = shallow(<ModalLayerDetails {...props} />);

    return { wrapper };
};

describe('<ModalLayerDetails />', () => {
    const { wrapper } = setup();

    it('should render <ModalLayerDetailsView/> ', () => {
        expect(wrapper.find(ModalLayerDetailsView).exists()).toBe(true);
    });
});
