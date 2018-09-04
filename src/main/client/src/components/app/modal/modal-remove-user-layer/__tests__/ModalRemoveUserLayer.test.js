import React from 'react';
import { shallow } from 'enzyme';

import ModalRemoveUserLayer from '../ModalRemoveUserLayer';
import ModalContainer from '../../../shared/Modal/ModalContainer';

const setup = () => {
    const props = {
        layerId: '123',
        removeUserLayerConfirmed: jest.fn(),
    };
    const wrapper = shallow(<ModalRemoveUserLayer {...props} />);
    return { props, wrapper };
};

describe('<ModalRemoveUserLayer />', () => {
    const { wrapper } = setup();

    it('should render correctly', () => {
        expect(wrapper.find(ModalContainer).exists()).toBe(true);
    });
});
