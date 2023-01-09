import React from 'react';
import { mount } from 'enzyme';
import SketchTool from '../SketchTool';
import SketchToolView from '../SketchToolView';

const setup = () => {
    const props = {
        view: {},
        data: [],
        activeAdminTool: '',
        draw: {
            initialized: true,
            reset: jest.fn(),
        },
        tempGraphicsLayer: { graphics: [] },
        setTempGraphicsLayer: jest.fn(),
        setActiveTool: jest.fn(),
        sketchViewModel: {
            cancel: jest.fn(),
            initialized: true,
        },
        setActiveFeatureMode: jest.fn(),
        resetFeatureNoGeometry: () => {},
    };
    const wrapper = mount(<SketchTool {...props} />);

    return { wrapper };
};

describe.skip('<SketchTool />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(SketchToolView).exists()).toBe(true);
    });

    it('should invoke SketchTool when sketchViewModel completed', () => {
        const prevProps = {
            sketchViewModel: {
            },
            draw: {
            },
            activeAdminTool: '',
            resetFeatureNoGeometry: () => {},
        };
        const spy = jest.spyOn(wrapper.instance(), 'sketchTool');
        wrapper.instance().componentDidUpdate(prevProps);
        expect(spy).toHaveBeenCalled();
    });

    it('should invoke removeSketch when draw completed', () => {
        const prevProps = {
            sketchViewModel: {
            },
            draw: {
            },
            activeAdminTool: 'sketchActiveAdmin',
            resetFeatureNoGeometry: () => {},
        };
        const spy = jest.spyOn(wrapper.instance(), 'removeSketch');
        wrapper.instance().componentDidUpdate(prevProps);
        expect(spy).toHaveBeenCalled();
    });
});
