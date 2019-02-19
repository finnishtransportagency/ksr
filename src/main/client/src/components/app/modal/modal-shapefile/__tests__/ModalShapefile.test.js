import React from 'react';
import MediaQuery from 'react-responsive';
import { shallow } from 'enzyme';
import ModalShapefile from '../ModalShapefile';
import ModalContainer from '../../../shared/Modal/ModalContainer';
import ModalShapefileView from '../ModalShapefileView';

const setup = (prop) => {
    const minProps = {
        view: {},
        setActiveModal: jest.fn(),
        layerList: [],
        addShapefile: jest.fn(),
        toggleDropzoneActive: jest.fn(),
        dropzone: true,
    };

    const props = prop || minProps;
    const wrapper = shallow(<ModalShapefile {...props} />);

    return { props, wrapper };
};

describe('<ModalShapefile />', () => {
    it('should render itself', () => {
        const { wrapper } = setup();
        expect(wrapper.find(ModalContainer).exists()).toBe(true);
        expect(wrapper.find(ModalShapefileView).exists()).toBe(true);
        expect(wrapper.find(MediaQuery).exists()).toBe(true);
    });
});
