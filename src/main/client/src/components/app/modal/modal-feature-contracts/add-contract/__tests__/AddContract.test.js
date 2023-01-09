import React from 'react';
import { shallow } from 'enzyme';
import * as fetchMock from '../../../../../../api/contract/contractRelations';
import FeatureDetailsForm from '../../../../shared/feature-details-form/FeatureDetailsForm';
import LoadingIcon from '../../../../shared/LoadingIcon';
import AddContract from '../AddContract';

const setup = (prop) => {
    fetchMock.fetchContractRelation = jest.fn(() => Promise.resolve({ features: null }));

    const minProps = {
        contractLayer: { id: 123 },
        setFormOptions: jest.fn(),
    };
    const props = prop || minProps;
    const wrapper = shallow(<AddContract {...props} />);
    return { wrapper };
};

describe.skip('<AddContract />', () => {
    const { wrapper } = setup();

    it('render - should render add contract list view', () => {
        wrapper.setState({ fetching: false });
        expect(wrapper.find(LoadingIcon).exists()).toBe(false);
        expect(wrapper.find(FeatureDetailsForm).exists()).toBe(true);
    });
});

