import React from 'react';
import { mount } from 'enzyme';
import Dropzone from 'react-dropzone';
import ModalShapefileView from '../ModalShapefileView';
import { DropzoneText } from '../styles';
import { Button } from '../../../../ui/elements';
import strings from '../../../../../translations';


const setup = () => {
    const props = {
        onDrop: jest.fn(),
        acceptedExtensions: '.shp,.dbf',
        fileUploadRef: jest.fn(),
        closeModal: jest.fn(),
    };
    const wrapper = mount(<ModalShapefileView {...props} />);

    return { props, wrapper };
};

describe('<ModalShapefileView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(Dropzone).exists()).toBe(true);
    });
    it('should render children', () => {
        expect(wrapper.find(Button).length).toBe(1);
        expect(wrapper.find('p').first().text()).toBe(strings.dropzoneShape.dropText);
        expect(wrapper.find('p').last().text()).toBe(strings.dropzoneShape.orText);
    });
});
