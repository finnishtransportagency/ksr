import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Home from '../Home';
import HomeView from '../HomeView';

describe('<Home />', () => {
    const wrapper = shallow(<Home />);

    it('renders <Home />', () => {
        expect(wrapper.exists()).to.be.true;
    });

    it('renders <HomeView />', () => {
        expect(wrapper.find(HomeView)).to.have.length(1);
    });
});
