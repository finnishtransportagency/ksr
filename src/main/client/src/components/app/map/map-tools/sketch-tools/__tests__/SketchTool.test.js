import React from 'react';
import { mount } from 'enzyme';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import SketchTool2 from '../SketchTool2';
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
        sketchViewModel: new SketchViewModel(),
        setActiveFeatureMode: jest.fn(),
        resetFeatureNoGeometry: () => {},
    };
    const wrapper = mount(<SketchTool2 {...props} />);

    return { wrapper };
};

describe('<SketchTool2 />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(SketchToolView).exists()).toBe(true);
    });

    /** Note!
     *  Test below should be rewritten for SketchTool2
     *  Private functions can't be spied.
     * */
/*    it('should invoke SketchTool when sketchViewModel completed', () => {
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
    }); */
});
