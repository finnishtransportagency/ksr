import React from 'react';
import { mount } from 'enzyme';
import ModalDeleteSelectedView from '../ModalDeleteSelectedView';
import { TextArea, FilteredDataTable } from '../styles';

const setup = (prop) => {
    const minProps = {
        selectedData: [
            {
                _id: 1,
                name: 'test',
                Shape_Area: 123456,
            },
            {
                _id: 2,
                name: 'test 2',
                Shape_Area: 654321,
            },
        ],
        deleteComment: '',
        handleTextareaChange: jest.fn(),
        filteredData: [
            {
                _id: 1,
                name: 'test',
            },
            {
                _id: 2,
                name: 'test 2',
            },
        ],
    };
    const props = prop || minProps;
    const wrapper = mount(<ModalDeleteSelectedView {...props} />);

    return { props, wrapper };
};

describe.skip('<ModalDeleteSelectedView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should contain correct ui elements', () => {
        expect(wrapper.find(TextArea)).toHaveLength(1);
        expect(wrapper.find(FilteredDataTable)).toHaveLength(1);
    });

    it('should handle input change', () => {
        const { handleTextareaChange } = wrapper.props();

        expect(handleTextareaChange).not.toHaveBeenCalled();
        wrapper.find(TextArea).simulate('change');
        expect(handleTextareaChange).toHaveBeenCalled();
    });

    it('should have correct amounts of table headings', () => {
        expect(wrapper.find(FilteredDataTable).find('th')).toHaveLength(1);
    });

    it('should have correct amounts of table rows', () => {
        expect(wrapper.find(FilteredDataTable).find('tbody').find('tr')).toHaveLength(2);
    });
});
