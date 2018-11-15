import React from 'react';
import { shallow } from 'enzyme';
import LoadingIcon from '../../../../shared/LoadingIcon';
import PropertyInfoView from '../property-info/PropertyInfoView';
import PropertyPrintFilesView from '../property-print-files/PropertyPrintFilesView';
import SearchPropertyView from '../SearchPropertyView';

const setup = (prop) => {
    const minProps = {
        propertyId: null,
        properties: null,
        links: null,
        fetching: false,
        fetchingLinks: false,
    };

    const props = prop || minProps;
    const wrapper = shallow(<SearchPropertyView {...props} />);

    return { wrapper };
};

describe('<SearchPropertyView />', () => {
    it('render - should render LoadingIcon', () => {
        const props = {
            propertyId: null,
            properties: null,
            links: null,
            fetching: true,
            fetchingLinks: false,
        };
        const { wrapper } = setup(props);

        expect(wrapper.find(LoadingIcon).exists()).toBe(true);
    });

    it('render - should render LoadingIcon', () => {
        const props = {
            propertyId: null,
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
        };
        const { wrapper } = setup(props);

        expect(wrapper.find(PropertyInfoView).exists()).toBe(true);
        expect(wrapper.find(PropertyPrintFilesView).exists()).toBe(true);
    });
});
