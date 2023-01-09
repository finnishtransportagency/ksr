import React from 'react';
import { shallow } from 'enzyme';
import ModalContainer from '../../../shared/Modal/ModalContainer';
import ModalBufferSelected from '../ModalBufferSelected';
import ModalBufferSelectedView from '../ModalBufferSelectedView';

const setup = (prop) => {
    const minProps = {
        selectedGeometryData: [{}],
        tableGeometryData: [{}],
        view: {},
        setSingleLayerGeometry: jest.fn(),
    };

    const props = prop || minProps;
    const wrapper = shallow(<ModalBufferSelected {...props} />);

    return { props, wrapper };
};

describe.skip('<ModalBufferSelected />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('contains <ModalContainer />', () => {
        expect(wrapper.find(ModalContainer).length).toBe(1);
    });
    it('contains <ModalBufferSelectedView />', () => {
        expect(wrapper.find(ModalBufferSelectedView).length).toBe(1);
    });
});
