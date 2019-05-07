import React from 'react';
import { shallow } from 'enzyme';
import * as fetchMock from '../../../../../../api/contract/contractRelations';
import FeatureDetailsForm from '../../../../shared/feature-details-form/FeatureDetailsForm';
import LoadingIcon from '../../../../shared/LoadingIcon';
import EditContract from '../EditContract';

const setup = (prop) => {
    fetchMock.fetchContractRelation = jest.fn(() => Promise.resolve({ features: null }));

    const minProps = {
        fields: [],
        setFormOptions: jest.fn(),
        objectId: 123,
        contractNumber: 123,
        currentLayer: {
            id: 1,
        },
    };
    const props = prop || minProps;
    const wrapper = shallow(<EditContract {...props} />);
    return { wrapper };
};

describe('<EditContract />', () => {
    const { wrapper } = setup();

    it('render - should render edit contract list view', () => {
        wrapper.setState({ fetching: false });
        expect(wrapper.find(LoadingIcon).exists()).toBe(false);
        expect(wrapper.find(FeatureDetailsForm).exists()).toBe(true);
    });
});
