import { parseQueryString } from '../parseQueryString';

let searchFieldValues = [
    {
        name: 'fieldName1',
        queryExpression: '=',
        queryText: 'helsinki',
    },
];
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
];

describe('parseQueryString', () => {
    it('should parse query string with field search', () => {
        const queryString = parseQueryString(searchFieldValues, textSearch, optionsField);

        expect(queryString).toBe('fieldName1+%3D+%27helsinki%27');
    });

    it('should parse query string with default search', () => {
        searchFieldValues = [];
        const queryString = parseQueryString(searchFieldValues, textSearch, optionsField);

        expect(queryString).toBe('fieldName1+LIKE+%27%25helsinki%25%27' +
            '+OR+' +
            'fieldName2+LIKE+%27%25helsinki%25%27');
    });
});
