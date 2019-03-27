import { parseQueryString } from '../parseQueryString';

let searchFieldValues = [];
const textSearch = 'helsinki';
const optionsField = [
    {
        value: '1',
        label: 'fieldName1',
    },
    {
        value: '2',
        label: 'fieldName2',
    },
    {
        value: '3',
        label: 'fieldName3',
    },
    {
        value: '4',
        label: 'fieldName4',
    },
    {
        value: '5',
        label: 'fieldName5',
    },
];
const queryColumnsList = [
    'fieldName1',
    'fieldName2',
    'fieldName3',
];

describe('parseQueryString', () => {
    it('should parse query string with default search', () => {
        const queryString = parseQueryString(
            searchFieldValues,
            textSearch,
            optionsField,
            queryColumnsList,
        );

        expect(queryString).toBe("LOWER(fieldName1) LIKE LOWER('%helsinki%') OR"
            + ' LOWER(fieldName2) LIKE'
            + " LOWER('%helsinki%') OR LOWER(fieldName3) LIKE LOWER('%helsinki%')");
    });

    it('should parse query string with field search', () => {
        searchFieldValues = [
            {
                name: 'fieldName1',
                queryExpression: '=',
                queryText: 'helsinki',
            },
        ];
        const queryString = parseQueryString(
            searchFieldValues,
            textSearch,
            optionsField,
            queryColumnsList,
        );

        expect(queryString).toBe("LOWER(fieldName1) = LOWER('helsinki')");

        searchFieldValues = [
            {
                name: 'fieldName2',
                queryExpression: '%',
                queryText: 'turku',
            },
        ];
        const queryString2 = parseQueryString(
            searchFieldValues,
            textSearch,
            optionsField,
            queryColumnsList,
        );

        expect(queryString2).toBe("LOWER(fieldName2) LIKE LOWER('%turku%')");
    });
});
