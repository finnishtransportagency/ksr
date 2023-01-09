import React from 'react';
import { shallow } from 'enzyme';
import ModalShapefileView from '../ModalShapefileView';
import ShapefileDropView from '../shapefile-drop/ShapefileDropView';
import ShapefileColorView from '../shapefile-color/ShapefileColorView';


const setup = () => {
    const props = {
        onDrop: jest.fn(),
        color: null,
        setColor: jest.fn(),
        acceptedFiles: [],
    };
    const wrapper = shallow(<ModalShapefileView {...props} />);

    return { props, wrapper };
};

describe.skip('<ModalShapefileView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should have <ShapefileDropView />', () => {
        expect(wrapper.find(ShapefileDropView).length).toBe(1);
    });

    it('should have <ShapefileColorView />', () => {
        expect(wrapper.find(ShapefileColorView).length).toBe(1);
    });
});
