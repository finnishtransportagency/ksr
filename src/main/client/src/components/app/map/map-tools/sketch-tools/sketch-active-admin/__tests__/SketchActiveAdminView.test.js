import React from 'react';
import { shallow } from 'enzyme';
import SketchActiveAdminView from '../SketchActiveAdminView';

const setup = () => {
    const props = {
        layer: {
            graphics: {},
        },
        activeAdminTool: '',
    };

    const wrapper = shallow(<SketchActiveAdminView {...props} />);

    return { wrapper };
};

describe('<SketchActiveAdminView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find('#reject-create-new-feature').exists()).toBe(true);
        expect(wrapper.find('#accept-create-new-feature').exists()).toBe(true);
        expect(wrapper.find('#draw-create-new-feature').exists()).toBe(true);
    });
});
