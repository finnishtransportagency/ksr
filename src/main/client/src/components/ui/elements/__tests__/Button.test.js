import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Button } from '../Button';

describe('<Button />', () => {
    it('works', () => {
        const tree = renderer.create(<Button />).toJSON();
        expect(tree).toMatchSnapshot();
        expect(tree).toHaveStyleRule('color', '#F1F1F1');
        expect(tree).toHaveStyleRule('background', '#3DB7E4');
    });

    it('sets correct styles with flat prop', () => {
        const tree = renderer.create(<Button flat />).toJSON();
        expect(tree).toHaveStyleRule('color', '#3DB7E4');
        expect(tree).toHaveStyleRule('background', 'none');
    });

    it('sets correct styles with disabled prop', () => {
        const tree = renderer.create(<Button disabled />).toJSON();
        expect(tree).toHaveStyleRule('opacity', '0.5');
    });
});
