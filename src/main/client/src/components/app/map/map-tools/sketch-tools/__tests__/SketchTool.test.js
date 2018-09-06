import React from 'react';
import { mount } from 'enzyme';
import SketchTool from '../SketchTool';
import SketchToolView from '../SketchToolView';

const setup = () => {
    const props = {
        view: {},
        data: [],
        adminToolActive: '',
        draw: {},
        tempGraphicsLayer: { graphics: { grap: {} } },
        setTempGrapLayer: jest.fn(),
        setActiveTool: jest.fn(),
        sketchViewModel: {
            reset: jest.fn(),
        },
    };
    const wrapper = mount(<SketchTool {...props} />);

    return { wrapper };
};

describe('<SketchTool />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(SketchToolView).exists()).toBe(true);
    });

    it('should invoke SketchTool when sketchViewModel completed', () => {
        const newProps = {
            sketchViewModel: {
                initialized: true,
            },
            draw: {
                initialized: false,
            },
            activeAdminTool: '',
        };
        const spy = jest.spyOn(wrapper.instance(), 'sketchTool');
        wrapper.instance().componentWillReceiveProps(newProps);
        expect(spy).toHaveBeenCalled();
    });

    it('should invoke removeSketch when draw completed', () => {
        const newProps = {
            sketchViewModel: {
                initialized: true,
            },
            draw: {
                initialized: true,
                reset: jest.fn(),
            },
            adminToolActive: 'sketchActiveAdmin',
        };
        const spy = jest.spyOn(wrapper.instance(), 'removeSketch');
        wrapper.instance().componentWillReceiveProps(newProps);
        expect(spy).toHaveBeenCalled();
    });
});
