import {
    filterExpressionsByType, parseQueryString, searchFieldIsNumber,
} from '../parseQueryString';
import strings from '../../../translations';

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
                queryDate: '',
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
                queryExpression: 'LIKE',
                queryText: 'turku',
                queryDate: '',
            },
        ];
        const queryString2 = parseQueryString(
            searchFieldValues,
            textSearch,
            optionsField,
            queryColumnsList,
        );

        expect(queryString2).toBe("LOWER(fieldName2) LIKE LOWER('%turku%')");

        searchFieldValues = [
            {
                name: 'fieldName3',
                queryExpression: '<',
                queryText: '3',
                queryDate: '',
                type: 'esriFieldTypeSmallInteger',
            },
        ];
        const queryString3 = parseQueryString(
            searchFieldValues,
            textSearch,
            optionsField,
            queryColumnsList,
        );

        expect(queryString3).toBe('fieldName3 < 3');

        searchFieldValues = [
            {
                name: 'fieldName4',
                queryExpression: 'NOT',
                queryText: 'helsinki',
                queryDate: '',
                type: 'esriFieldTypeString',
            },
        ];
        const queryString4 = parseQueryString(
            searchFieldValues,
            textSearch,
            optionsField,
            queryColumnsList,
        );

        expect(queryString4).toBe("NOT LOWER(fieldName4) = LOWER('helsinki') OR fieldName4 IS NULL");

        searchFieldValues = [
            {
                name: 'fieldName5',
                queryExpression: 'NOT LIKE',
                queryText: 'helsinki',
                queryDate: '',
                type: 'esriFieldTypeString',
            },
        ];
        const queryString5 = parseQueryString(
            searchFieldValues,
            textSearch,
            optionsField,
            queryColumnsList,
        );

        expect(queryString5).toBe("NOT LOWER(fieldName5) LIKE LOWER('%helsinki%') OR fieldName5 IS NULL");
    });
});

describe('parseQueryString - searchFieldIsNumber', () => {
    it('should return true', () => {
        expect(searchFieldIsNumber('esriFieldTypeOID')).toBe(true);
        expect(searchFieldIsNumber('esriFieldTypeSmallInteger')).toBe(true);
        expect(searchFieldIsNumber('esriFieldTypeInteger')).toBe(true);
        expect(searchFieldIsNumber('esriFieldTypeDouble')).toBe(true);
    });

    it('should return false', () => {
        expect(searchFieldIsNumber('esriFieldTypeString')).toBe(false);
        expect(searchFieldIsNumber('esriFieldTypeDate')).toBe(false);
        expect(searchFieldIsNumber('test123')).toBe(false);
    });
});

describe('parseQueryString - filterExpressionsByType', () => {
    it('should return number types', () => {
        const numberExpressions = [
            {
                value: '=',
                label: strings.search.expression.exact,
                types: ['string', 'number'],
            },
            {
                value: '<',
                label: strings.search.expression.lessThan,
                types: ['number'],
            },
            {
                value: '>',
                label: strings.search.expression.greaterThan,
                types: ['number'],
            },
            {
                value: 'NOT',
                label: strings.search.expression.not,
                types: ['string', 'number'],
            },
        ];

        expect(filterExpressionsByType('esriFieldTypeOID')).toEqual(numberExpressions);
        expect(filterExpressionsByType('esriFieldTypeSmallInteger')).toEqual(numberExpressions);
        expect(filterExpressionsByType('esriFieldTypeInteger')).toEqual(numberExpressions);
        expect(filterExpressionsByType('esriFieldTypeDouble')).toEqual(numberExpressions);
    });

    it('should return string types', () => {
        const stringExpressions = [
            {
                value: 'LIKE',
                label: strings.search.expression.like,
                types: ['string'],
            },
            {
                value: '=',
                label: strings.search.expression.exact,
                types: ['string', 'number'],
            },
            {
                value: 'NOT',
                label: strings.search.expression.not,
                types: ['string', 'number'],
            },
            {
                value: 'NOT LIKE',
                label: strings.search.expression.notLike,
                types: ['string'],
            },
        ];

        expect(filterExpressionsByType('esriFieldTypeString')).toEqual(stringExpressions);
        expect(filterExpressionsByType('esriFieldTypeDate')).toEqual(stringExpressions);
        expect(filterExpressionsByType('test123')).toEqual(stringExpressions);
    });

    it('should parse query string with empty field search', () => {
        searchFieldValues = [
            {
                name: 'fieldName1',
                queryExpression: '=',
                queryText: '',
                queryDate: '',
            },
        ];

        const queryString = parseQueryString(
            searchFieldValues,
            textSearch,
            optionsField,
            queryColumnsList,
        );

        expect(queryString).toBe('fieldName1 IS NULL');

        searchFieldValues = [
            {
                name: 'fieldName2',
                queryExpression: 'NOT',
                queryText: '',
                queryDate: '',
            },
        ];

        const queryString2 = parseQueryString(
            searchFieldValues,
            textSearch,
            optionsField,
            queryColumnsList,
        );

        expect(queryString2).toBe('fieldName2 IS NOT NULL');

        searchFieldValues = [
            {
                name: 'fieldName3',
                queryExpression: '<',
                queryText: '',
                queryDate: '',
            },
        ];

        const queryString3 = parseQueryString(
            searchFieldValues,
            textSearch,
            optionsField,
            queryColumnsList,
        );

        expect(queryString3).toBe('');
    });

    it('should parse query date with field search', () => {
        searchFieldValues = [
            {
                name: 'fieldName1',
                queryExpression: '=',
                queryText: '',
                queryDate: '2018-02-22',
            },
        ];

        const queryString = parseQueryString(
            searchFieldValues,
            textSearch,
            optionsField,
            queryColumnsList,
        );

        expect(queryString).toBe("CAST(SUBSTRING(fieldName1,0,10) AS DATE) = DATE '2018-02-22'");

        searchFieldValues = [
            {
                name: 'fieldName1',
                queryExpression: '=',
                queryText: '',
                queryDate: '2018-02-22',
            },
            {
                name: 'fieldName2',
                queryExpression: '=',
                queryText: 'helsinki',
                queryDate: '',
            },
        ];

        const queryString2 = parseQueryString(
            searchFieldValues,
            textSearch,
            optionsField,
            queryColumnsList,
        );

        expect(queryString2).toBe("CAST(SUBSTRING(fieldName1,0,10) AS DATE) = DATE '2018-02-22' AND LOWER(fieldName2) = LOWER('helsinki')");
    });
});
