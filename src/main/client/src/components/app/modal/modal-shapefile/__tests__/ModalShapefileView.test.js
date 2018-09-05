import React from 'react';
import { shallow } from 'enzyme';
import Dropzone from 'react-dropzone';
import ModalShapefileView from '../ModalShapefileView';
import { DropzoneText } from '../styles';
import { Button } from '../../../../ui/elements/index';


const setup = () => {
    const props = {
        onDrop: jest.fn(),
        acceptedExtensions: '.shp,.dbf',
    };
    const wrapper = shallow(<ModalShapefileView {...props} />);

    return { props, wrapper };
};

describe('<ModalShapefileView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(Dropzone).exists()).toBe(true);
    });
    it('should render self', () => {
        expect(wrapper.find(DropzoneText).exists()).toBe(true);
    });
    it('should render self', () => {
        expect(wrapper.find(Button).exists()).toBe(true);
    });
});
