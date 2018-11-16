import React from 'react';
import { shallow } from 'enzyme';
import { PropertyFeature } from '../../styles';
import PropertyInfoView from '../PropertyInfoView';

const setup = (prop) => {
    const minProps = {
        properties: {
            parcelCount: 1,
            registerUnitType: 'register unit',
            name: 'property name',
            landArea: 123.123,
            registrationDate: '20151231',
            municipalityName: 'municipality name',
            propertyIdentifier: '123456789',
        },
    };

    const props = prop || minProps;
    const wrapper = shallow(<PropertyInfoView {...props} />);

    return { wrapper };
};

describe('<PropertyInfoView />', () => {
    it('render - should render all property data', () => {
        const { wrapper } = setup();

        expect(wrapper.find(PropertyFeature)).toHaveLength(7);
    });
});
