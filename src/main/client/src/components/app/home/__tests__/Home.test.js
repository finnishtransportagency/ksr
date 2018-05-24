import React from 'react';
import { shallow } from 'enzyme';
import Home from '../Home';
import HomeView from '../HomeView';

function setup() {
    const props = {};
    const wrapper = shallow(<Home />);

    return { props, wrapper };
}

describe('components', () => {
    describe('<Home />', () => {
        const { wrapper } = setup();

        it('should contain HomeView', () => {
            expect(wrapper.find(HomeView).length).toBe(1);
        });
    });
});
