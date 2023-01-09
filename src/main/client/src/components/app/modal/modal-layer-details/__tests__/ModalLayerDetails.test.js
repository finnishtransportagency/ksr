import React from 'react';
import { shallow } from 'enzyme';
import FeatureDetailsForm from '../../../shared/feature-details-form/FeatureDetailsForm';
import ModalLayerDetails from '../ModalLayerDetails';

const setup = () => {
    const props = {
        dataFields: [],
        data: {},
        layer: {
            graphics: {
                items: [{
                    geometry: {
                        x: 123,
                        y: 123,
                        type: 'point',
                    },
                }],
            },
        },
        activeLayer: {
            contractIdField: 123,
            relationColumnOut: 'columnOut',
        },
        setTempGraphicsLayer: jest.fn(),
    };
    const wrapper = shallow(<ModalLayerDetails {...props} />);

    return { wrapper };
};

describe.skip('<ModalLayerDetails />', () => {
    const { wrapper } = setup();

    it('should render <ModalLayerDetailsView/> ', () => {
        expect(wrapper.find(FeatureDetailsForm).exists()).toBe(true);
    });

    it('should handle setFormOptions', () => {
        const expectedResult = {
            editedFields: { id: 123 },
            submitDisabled: false,
        };

        wrapper.instance().setFormOptions({ editedFields: { id: 123 }, submitDisabled: false });
        expect(wrapper.state('formOptions')).toEqual(expectedResult);
    });
});
