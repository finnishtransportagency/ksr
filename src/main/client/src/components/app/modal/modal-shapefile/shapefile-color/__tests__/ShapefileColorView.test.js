import React from 'react';
import { shallow } from 'enzyme';
import ShapefileColorView from '../ShapefileColorView';
import { H2 } from '../../../../../ui/elements';
import strings from '../../../../../../translations';
import { Color, ColorInput } from '../styles';

describe('<ShapefileColorView />', () => {
    const setup = (color) => {
        const props = {
            color: color || null,
            setColor: jest.fn(),
        };

        return {
            props,
            wrapper: shallow(<ShapefileColorView {...props} />),
        };
    };

    it('should render', () => {
        const { wrapper } = setup();
        expect(wrapper.exists()).toBeTruthy();
    });

    it('should have title', () => {
        const { wrapper } = setup();
        const title = wrapper.find(H2).first();
        expect(title.text()).toBe(strings.shapefileColorView.title);
    });

    it('should have five (5) predefined colors', () => {
        const { wrapper } = setup();
        expect(wrapper.find(Color).length).toBe(5);
    });

    it('should have a ColorInput', () => {
        const { wrapper } = setup();
        expect(wrapper.find(ColorInput).length).toBe(1);
    });

    it('should have no selected colors', () => {
        const { wrapper } = setup();
        const selected = wrapper.findWhere(e => e.prop('selected'));
        expect(selected.length).toBe(0);
    });

    it('should have correct selected Color -element', () => {
        const { wrapper } = setup('#e55934');
        const selected = wrapper.findWhere(e => e.prop('selected') && e.prop('color') === '#e55934');
        expect(selected.length).toBe(1);
    });

    it('should call setColor when element clicked', () => {
        const { wrapper, props } = setup();
        wrapper.find(Color).first().simulate('click');
        expect(props.setColor.mock.calls[0][0]).toBe('#e55934');
    });

    it('should have color input selected if custom color given', () => {
        const { wrapper } = setup('#fff');
        expect(
            wrapper.findWhere(e => e.prop('selected') && e.prop('type') === 'color').length,
        ).toBe(1);
    });

    it('should call setColor when custom color selected', () => {
        const { wrapper, props } = setup();
        wrapper.find(ColorInput).first().simulate('input', { target: { value: '#98002E' } });
        expect(props.setColor.mock.calls[0][0]).toBe('#98002E');
    });
});
