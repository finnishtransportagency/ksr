import React from 'react';
import { shallow } from 'enzyme';
import SearchProperty from '../SearchProperty';
import SearchPropertyView from '../SearchPropertyView';

describe('<SearchProperty />', () => {
    const setup = (props) => {
        const initialProps = {
            features: [],
            fetching: false,
            handleSubmit: jest.fn(),
            handleClear: jest.fn(),
            setPropertyId: jest.fn(),
            view: {},
            authorities: [{ authority: 'KSR_ROLE_ADMIN' }],
        };

        const currentProps = props || initialProps;
        const wrapper = shallow(<SearchProperty {...currentProps} />);

        return { wrapper, props: currentProps };
    };

    it('should render', () => {
        const { wrapper } = setup();
        expect(wrapper.exists()).toBeTruthy();
    });

    it('should contain a <SearchPropertyView />', () => {
        const { wrapper } = setup();
        expect(wrapper.find(SearchPropertyView).length).toBe(1);
    });

    it('handlePropertyClick - should handle single property click correctly', () => {
        const { wrapper } = setup();
        const id = '123456789';

        wrapper.setState({ activeProperty: '987654321' });
        wrapper.instance().handlePropertyClick(id);
        expect(wrapper.state('activeProperty')).toBe(id);

        wrapper.instance().handlePropertyClick(id);
        expect(wrapper.state('activeProperty')).toBe('');
    });

    it('should handle onSubmit', () => {
        const { wrapper, props } = setup();
        wrapper.instance().onSubmit({ preventDefault: () => {} });
        expect(props.handleSubmit.mock.calls.length).toBe(1);
    });

    it('should handle onClear', () => {
        const { wrapper, props } = setup();
        wrapper.instance().onClear({ preventDefault: () => {} });
        expect(props.handleClear.mock.calls.length).toBe(1);
    });

    it('should validatePropertyId', () => {
        const { wrapper } = setup();
        expect(wrapper.instance().validatePropertyId(null)).toBeFalsy();
        expect(wrapper.instance().validatePropertyId(undefined)).toBeFalsy();
        expect(wrapper.instance().validatePropertyId({})).toBeFalsy();
        expect(wrapper.instance().validatePropertyId(1)).toBeFalsy();
        expect(wrapper.instance().validatePropertyId([])).toBeFalsy();
        expect(wrapper.instance().validatePropertyId(() => {})).toBeFalsy();
        expect(wrapper.instance().validatePropertyId('a')).toBeFalsy();
        expect(wrapper.instance().validatePropertyId('1-2-3-4-')).toBeFalsy();
        expect(wrapper.instance().validatePropertyId('0010020003004')).toBeFalsy();
        expect(wrapper.instance().validatePropertyId('001002000300400')).toBeFalsy();

        expect(wrapper.instance().validatePropertyId('1-2-3-4')).toBeTruthy();
        expect(wrapper.instance().validatePropertyId('00100200030004')).toBeTruthy();
    });

    it('should handle handleProperyIdChange', () => {
        const { wrapper } = setup();
        const evt = { target: { value: '1-2-3-4' } };
        wrapper.instance().handleProperyIdChange(evt);
        expect(wrapper.state('propertyId')).toBe('1-2-3-4');
    });
});
