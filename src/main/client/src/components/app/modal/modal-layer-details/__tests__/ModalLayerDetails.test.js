import React from 'react';
import { shallow } from 'enzyme';
import ModalLayerDetails from '../ModalLayerDetails';
import ModalLayerDetailsView from '../ModalLayerDetailsView';

const setup = () => {
    const props = {
        fields: [
            { name: 'Field1' },
            { name: 'Field2' },
            { name: 'Field3' },
        ],
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
        },
        setTempGraphicsLayer: jest.fn(),
    };
    const wrapper = shallow(<ModalLayerDetails {...props} />);

    return { wrapper };
};

describe('<ModalLayerDetails />', () => {
    const { wrapper } = setup();

    it('should render <ModalLayerDetailsView/> ', () => {
        expect(wrapper.find(ModalLayerDetailsView).exists()).toBe(true);
    });

    it('should handle loadFields', () => {
        const expectedResult = [
            { data: '', name: 'Field1', nullable: true },
            { data: '', name: 'Field2', nullable: true },
            { data: '', name: 'Field3', nullable: true },
        ];


        wrapper.instance().loadFields();
        expect(wrapper.state('dataFields')).toEqual(expectedResult);
    });

    it('should handle handleOnChange', () => {
        const expectedResult = [
            { data: 'Test Value', name: 'Field1', nullable: true },
            { data: '', name: 'Field2', nullable: true },
            { data: '', name: 'Field3', nullable: true },
        ];

        const evt = {
            target: {
                name: 'Field1',
                value: 'Test Value',
            },
        };

        const field = {
            name: 'Field1',
        };

        wrapper.instance().handleOnChange(evt, field);

        expect(wrapper.state('dataFields')).toEqual(expectedResult);
    });
});
