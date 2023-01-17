import { objectToCsv } from '../csvFile';

jest.mock('use-resize-observer', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
    })),
}));

describe('csvFile.js', () => {
    it('should correctly make CSV formated string', () => {
        const data = [{
            '141/LAND_AREA': 38.39,
            '141/LAST_EDITED_DATE': null,
            '141/LAST_EDITED_USER': null,
            '141/MANAGEMENT_AREA': null,
            '141/MUNICIPALITY_NAME': 'Utajärvi',
            '141/NAME': 'Rautatiealue',
            '141/OBJECTID': 83405,
            '141/PARCEL_COUNT': 2,
            '141/PROPERTY_ID': '889-871-1-3',
            '141/REGISTER_UNIT_TYPE': 4,
            '141/REGISTRATION_DATE': 1461888000000,
            '141/TOTAL_AREA': 38.359,
            geometry: {},
            _edited: [],
            _id: 83405,
            _key: '141/83405',
            _layerId: '141',
            _selected: true,
            _source: 'select',
        }];
        const columns = [
            {
                Header: 'Kiinteistötunnus',
                accessor: '141/PROPERTY_ID',
                className: '',
                domain: null,
                show: true,
                editable: true,
                nullable: true,
            },
            {
                Header: 'Nimi',
                accessor: '141/NAME',
                className: '',
                domain: null,
                show: true,
                editable: false,
                nullable: true,
            },
            {
                Header: 'Rekisteriyksikkölaji',
                accessor: '141/REGISTER_UNIT_TYPE',
                show: true,
                editable: false,
                nullable: true,
                domain: {
                    codedValues: [{
                        code: 0,
                        name: '(Tuntematon)',
                    }, {
                        code: 1,
                        name: 'Tila',
                    }, {
                        code: 3,
                        name: 'Valtion metsämaa',
                    }, {
                        code: 4,
                        name: 'Lunastusyksikkö',
                    }],
                    name: 'PROPERTY_REGISTER_UNIT_TYPE',
                    type: 'coded-value',
                },
            },
            {
                Header: 'Kunta',
                accessor: '141/MUNICIPALITY_NAME',
                className: '',
                domain: null,
                show: true,
                editable: false,
                nullable: true,
            },
            {
                Header: 'Rekisteröintipvm',
                accessor: '141/REGISTRATION_DATE',
                className: 'date',
                domain: null,
                show: true,
                editable: false,
                nullable: true,
            },
            {
                Header: 'Kokonaispinta-ala',
                accessor: '141/TOTAL_AREA',
                className: 'decimal',
                domain: null,
                show: true,
                editable: false,
                nullable: true,
            },
            {
                Header: 'Maa-ala',
                accessor: '141/LAND_AREA',
                className: 'decimal',
                domain: null,
                show: true,
                editable: false,
                nullable: true,
            },
            {
                Header: 'Palstojen lkm',
                accessor: '141/PARCEL_COUNT',
                className: '',
                domain: null,
                show: true,
                editable: false,
                nullable: true,
            },
            {
                Header: 'Hallinta-ala',
                accessor: '141/MANAGEMENT_AREA',
                className: 'decimal',
                domain: null,
                show: true,
                editable: false,
                nullable: true,
            },
            {
                Header: 'EDITOIJA',
                accessor: '141/LAST_EDITED_USER',
                className: '',
                domain: null,
                show: true,
                editable: true,
                nullable: true,
            },
            {
                Header: 'VIIMEINEN',
                accessor: '141/LAST_EDITED_DATE',
                className: 'date',
                domain: null,
                show: true,
            },
        ];

        const csvFile = 'Kiinteistötunnus,Nimi,Rekisteriyksikkölaji,Kunta,Rekisteröintipvm,Kokonaispinta-ala,Maa-ala,Palstojen lkm,Hallinta-ala,EDITOIJA,VIIMEINEN\n'
            + '"889-871-1-3","Rautatiealue","Lunastusyksikkö","Utajärvi","29.4.2016","38.359","38.39","2","","",""';

        expect(objectToCsv(data, columns)).toEqual(csvFile);
    });
});
