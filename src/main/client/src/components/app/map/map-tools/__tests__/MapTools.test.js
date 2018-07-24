import React from 'react';
import { shallow } from 'enzyme';
import MapMeasureContainer from '../map-measure/MapMeasureContainer';
import MapTools from '../MapTools';
import SketchToolContainer from '../sketch-tools/SketchToolContainer';

const setup = () => {
    const props = {
        activeNav: '',
        view: {},
        isOpenTable: false,
    };
    const wrapper = shallow(<MapTools {...props} />);

    return { props, wrapper };
};

describe('<MapTools />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(MapMeasureContainer).exists()).toBe(true);
        expect(wrapper.find(SketchToolContainer).exists()).toBe(true);
    });
});
