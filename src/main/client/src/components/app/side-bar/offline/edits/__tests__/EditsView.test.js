import React from 'react';
import { mount } from 'enzyme';
import EditsView from '../EditsView';
import { EditsWrapper } from '../styles';
import strings from '../../../../../../translations/fi';
import { Button } from '../../../../../ui/elements';

describe('<EditsView />', () => {
    const setup = (props) => {
        const wrapper = mount(<EditsView {...props} />);
        return { wrapper, props };
    };

    it('should render', () => {
        const props = {
            count: 1,
            retryEdits: jest.fn(),
            removeEdits: jest.fn(),
        };
        const { wrapper } = setup(props);
        expect(wrapper.exists()).toBe(true);
    });

    it('should contain text that no edits exists', () => {
        const props = {
            count: 0,
            retryEdits: jest.fn(),
            removeEdits: jest.fn(),
        };
        const { wrapper } = setup(props);
        const el = wrapper.find(EditsWrapper).first();
        const p = el.find('p').first();
        expect(p.text()).toBe(strings.offline.edits.noEdits);
    });

    it('should contain text that has edits', () => {
        const props = {
            count: 12,
            retryEdits: jest.fn(),
            removeEdits: jest.fn(),
        };
        const { wrapper } = setup(props);
        const el = wrapper.find(EditsWrapper).first();
        const p = el.find('p').first();
        expect(p.text()).toBe(`12 ${strings.offline.edits.hasEdits}`);
    });

    it('should send onClick-action for retryEdits', () => {
        const props = {
            count: 2,
            retryEdits: jest.fn(),
            removeEdits: jest.fn(),
        };
        const { wrapper } = setup(props);
        const el = wrapper.find(EditsWrapper).first();
        const button = el.find(Button).first();
        button.simulate('click');
        expect(props.retryEdits.mock.calls.length).toBe(1);
    });

    it('should send onClick-action for removeEdits', () => {
        const props = {
            count: 2,
            retryEdits: jest.fn(),
            removeEdits: jest.fn(),
        };
        const { wrapper } = setup(props);
        const el = wrapper.find(EditsWrapper).first();
        const button = el.find(Button).last();
        button.simulate('click');
        expect(props.removeEdits.mock.calls.length).toBe(1);
    });
});
