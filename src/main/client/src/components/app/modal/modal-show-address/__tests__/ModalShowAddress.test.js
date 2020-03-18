import React from 'react';
import { shallow } from 'enzyme';
import ModalShowAddress from '../ModalShowAddress';
import LoadingIcon from '../../../shared/LoadingIcon';
import ModalContainer from '../../../shared/Modal/ModalContainer';

const setup = () => {
    const props = {
        feature: {
            attributes: {},
            geometry: {
                x: 123,
                y: 123,
                type: 'point',
            },
            featureType: 'street',
        },
        address: '',
        modalSubmit: [],
        fetchingAddress: true,
    };
    const wrapper = shallow(<ModalShowAddress {...props} />);
    return { wrapper };
};

describe('<ModalShowAddress />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find(ModalContainer).exists()).toBe(true);
    });

    it('render - should render loading', () => {
        wrapper.setState({ fetchingAddress: true });
        expect(wrapper.find(LoadingIcon).exists()).toBe(true);
    });

    it('render - should render address field', () => {
        wrapper.setState({ fetchingAddress: false });
        expect(wrapper.find(LoadingIcon).exists()).toBe(false);
    });
});
