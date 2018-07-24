import React from 'react';
import { mount } from 'enzyme';
import SketchTool from '../SketchTool';
import SketchToolView from '../SketchToolView';

const setup = () => {
    const props = {
        view: {},
        data: [],
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
        };
        const spy = jest.spyOn(wrapper.instance(), 'sketchTool');
        wrapper.instance().componentWillReceiveProps(newProps);
        expect(spy).toHaveBeenCalled();
    });
});
