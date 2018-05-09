import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import HomeView from '../HomeView';
import { Wrapper } from '../styles';

describe('<HomeView />', () => {
    const wrapper = shallow(<HomeView />);

    it('renders <HomeView />', () => {
        expect(wrapper.exists()).to.be.true;
    });

    it('renders Wrapper', () => {
        expect(wrapper.find(Wrapper)).to.have.length(1);
    });
});
