import React from 'react';
import { mount } from 'enzyme';
import Property from '../../../../../ui/blocks/Property';
import LoadingIcon from '../../../../shared/LoadingIcon';
import PropertyInfoView from '../property-info/PropertyInfoView';
import PropertyPrintFilesView from '../property-print-files/PropertyPrintFilesView';
import SearchPropertyView from '../SearchPropertyView';

const setup = (prop) => {
    const minProps = {
        features: [],
        fetching: false,
        handlePropertyClick: jest.fn(),
        handlePropertyZoomClick: jest.fn(),
        activeProperty: '',
    };

    const props = prop || minProps;
    const wrapper = mount(<SearchPropertyView {...props} />);

    return { minProps, wrapper };
};

describe('<SearchPropertyView />', () => {
    it('render - should render LoadingIcon while fetching', () => {
        const { minProps } = setup();
        const props = {
            ...minProps,
            fetching: true,
        };
        const { wrapper } = setup(props);

        expect(wrapper.find(LoadingIcon).exists()).toBe(true);
        expect(wrapper.find(Property).length).toBe(0);
    });

    it('render - should render properties correctly', () => {
        const { minProps } = setup();
        const props = {
            ...minProps,
            features: [{
                id: '111-111-1111-1111',
                properties: {
                    parcelCount: 1,
                    registerUnitType: 'register unit',
                    name: 'property name',
                    landArea: 123.123,
                    registrationDate: '20151231',
                    municipalityName: 'municipality name',
                    propertyIdentifier: '123456789',
                },
                links: null,
                fetching: false,
                fetchingLinks: false,
            }, {
                id: '222-222-2222-2222',
                properties: {
                    parcelCount: 1,
                    registerUnitType: 'register unit',
                    name: 'property name',
                    landArea: 123.123,
                    registrationDate: '20151231',
                    municipalityName: 'municipality name',
                    propertyIdentifier: '123456789',
                },
                links: null,
                fetching: false,
                fetchingLinks: false,
            }, {
                id: '333-333-3333-3333',
                properties: {
                    parcelCount: 1,
                    registerUnitType: 'register unit',
                    name: 'property name',
                    landArea: 123.123,
                    registrationDate: '20151231',
                    municipalityName: 'municipality name',
                    propertyIdentifier: '123456789',
                },
                links: null,
                fetching: false,
                fetchingLinks: false,
            }],
        };
        const { wrapper } = setup(props);

        expect(wrapper.find(Property).length).toBe(3);
        expect(wrapper.find(PropertyInfoView).length).toBe(3);
        expect(wrapper.find(PropertyPrintFilesView).length).toBe(3);
    });

    it('render - should activate property on click', () => {
        const { minProps } = setup();
        const props = {
            ...minProps,
            features: [{
                id: '111-111-1111-1111',
                properties: {
                    parcelCount: 1,
                    registerUnitType: 'register unit',
                    name: 'property name',
                    landArea: 123.123,
                    registrationDate: '20151231',
                    municipalityName: 'municipality name',
                    propertyIdentifier: '123456789',
                },
                links: null,
                fetching: false,
                fetchingLinks: false,
            }, {
                id: '222-222-2222-2222',
                properties: {
                    parcelCount: 1,
                    registerUnitType: 'register unit',
                    name: 'property name',
                    landArea: 123.123,
                    registrationDate: '20151231',
                    municipalityName: 'municipality name',
                    propertyIdentifier: '123456789',
                },
                links: null,
                fetching: false,
                fetchingLinks: false,
            }, {
                id: '333-333-3333-3333',
                properties: {
                    parcelCount: 1,
                    registerUnitType: 'register unit',
                    name: 'property name',
                    landArea: 123.123,
                    registrationDate: '20151231',
                    municipalityName: 'municipality name',
                    propertyIdentifier: '123456789',
                },
                links: null,
                fetching: false,
                fetchingLinks: false,
            }],
        };
        const { wrapper } = setup(props);

        const { handlePropertyClick, handlePropertyZoomClick } = wrapper.props();

        wrapper.find(Property.Header.Toggle).at(0).simulate('click');
        wrapper.find(Property.Header.Toggle).at(1).simulate('click');
        wrapper.find(Property.Header.Toggle).at(2).simulate('click');

        wrapper.find(Property.Header.Zoom).at(0).simulate('click');
        wrapper.find(Property.Header.Zoom).at(1).simulate('click');
        wrapper.find(Property.Header.Zoom).at(2).simulate('click');

        expect(handlePropertyClick).toHaveBeenCalledTimes(3);
        expect(handlePropertyZoomClick).toHaveBeenCalledTimes(3);
    });
});
