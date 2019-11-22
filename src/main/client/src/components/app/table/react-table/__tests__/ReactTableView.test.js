import React from 'react';
import { shallow } from 'enzyme';
import ReactTableView from '../ReactTableView';
import { WrapperReactTable } from '../styles';

const setup = () => {
    const props = {
        data: [{
            '141/LAST_EDITED_DATE': 1573642458000,
            '141/NAME': 'Rautatiealue',
            '141/OBJECTID': 83405,
            '141/PARCEL_COUNT': 2,
            '141/PROPERTY_ID': '889-871-1-3',
            geometry: {},
            _edited: [],
            _id: 83405,
            _key: '141/83405',
            _layerId: '141',
            _selected: true,
            _source: 'select',

        }],
        columns: [
            {
                Header: 'Kiinteistötunnus',
                accessor: '141/PROPERTY_ID',
                className: '',
                domain: null,
                editable: true,
                nullable: true,
                show: true,
            }, {
                Header: 'Nimi',
                accessor: '141/NAME',
                className: '',
                domain: null,
                editable: false,
                nullable: true,
                show: true,
            }, {
                Header: 'OBJECTID',
                accessor: '141/OBJECTID',
                className: '',
                domain: null,
                editable: false,
                nullable: false,
                show: false,
            }, {
                Header: 'Palstojen lkm',
                accessor: '141/PARCEL_COUNT',
                className: '',
                domain: null,
                editable: false,
                nullable: true,
                show: true,
            }, {
                Header: 'VIIMEINEN',
                accessor: '141/LAST_EDITED_DATE',
                className: 'date',
                domain: null,
                editable: false,
                nullable: true,
                show: true,
            },
        ],
        toggleSelection: jest.fn(),
        toggleSelectAll: jest.fn(),
        selectAll: false,
        renderEditable: jest.fn(),
        renderFilter: jest.fn(),
    };
    const wrapper = shallow(<ReactTableView {...props} />);

    return { props, wrapper };
};

describe('<ReactTableView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(WrapperReactTable).length).toBe(1);
    });
});
