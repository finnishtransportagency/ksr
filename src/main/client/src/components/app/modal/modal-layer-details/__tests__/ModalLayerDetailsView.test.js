import React from 'react';
import { shallow } from 'enzyme';
import ModalLayerDetailsView from '../ModalLayerDetailsView';
import ModalLayerDetailsSingleView from '../modal-layer-details-single/ModalLayerDetailsSingleView';

const setup = () => {
    const props = {
        fields: [{ value: 1 },
            { value: 2 }],
        handleOnChange: jest.fn(),
    };

    const wrapper = shallow(<ModalLayerDetailsView {...props} />);

    return { wrapper };
};

describe('<ModalLayerDetailsView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(ModalLayerDetailsSingleView).exists()).toBe(true);
    });
});
