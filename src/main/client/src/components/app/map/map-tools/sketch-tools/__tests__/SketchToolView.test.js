import React from 'react';
import { shallow } from 'enzyme';
import SketchToolView from '../SketchToolView';

const setup = () => {
    const props = {
        removeSelection: jest.fn(),
        drawRectangleButtonRef: jest.fn(),
        drawPolygonButtonRef: jest.fn(),
        drawCircleButtonRef: jest.fn(),
        toggleSelectToolsButtonRef: jest.fn(),
        toggleTools: jest.fn(),
        hasSelectedFeatures: true,
        isOpen: false,
    };

    const wrapper = shallow(<SketchToolView {...props} />);

    return { wrapper };
};

describe.skip('<SketchToolView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find('#remove-selection').exists()).toBe(true);
        expect(wrapper.find('#draw-rectangle').exists()).toBe(true);
        expect(wrapper.find('#draw-polygon-select').exists()).toBe(true);
        expect(wrapper.find('#draw-circle').exists()).toBe(true);
        expect(wrapper.find('#toggle-select-tools').exists()).toBe(true);
    });
});
