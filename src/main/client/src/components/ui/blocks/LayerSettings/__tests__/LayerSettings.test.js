import React from 'react';
import renderer from 'react-test-renderer';
import LayerSettings from '../index';

describe('<LayerSettings />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<LayerSettings />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<LayerSettings.Icons />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<LayerSettings.Icons />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<LayerSettings.Drag />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<LayerSettings.Drag />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<LayerSettings.Slider />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<LayerSettings.Slider />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<LayerSettings.Title />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<LayerSettings.Title />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<LayerSettings.Toggle />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<LayerSettings.Toggle />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
