import React from 'react';
import renderer from 'react-test-renderer';
import LayerSettings from '../index';

describe.skip('<LayerSettings />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<LayerSettings />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});

describe.skip('<LayerSettings.Icons />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<LayerSettings.Icons />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});

describe.skip('<LayerSettings.Icon />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<LayerSettings.Icon />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});

describe.skip('<LayerSettings.Drag />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<LayerSettings.Drag />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});

describe.skip('<LayerSettings.Slider />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<LayerSettings.Slider />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});

describe.skip('<LayerSettings.Title />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<LayerSettings.Title />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});

describe.skip('<LayerSettings.Toggle />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<LayerSettings.Toggle />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
