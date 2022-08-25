// @flow

import strings from '../../translations';

/**
 * Checks whether search fields' type is any of the esri field number -types.
 *
 * @param {string} type Type of the search field.
 *
 * @returns {boolean} Returns true if type is a number.
 */
export const searchFieldIsNumber = (type: string) => {
    const fieldNumberTypes = ['esriFieldTypeOID', 'esriFieldTypeSmallInteger', 'esriFieldTypeInteger', 'esriFieldTypeDouble'];

    return fieldNumberTypes.some(numberType => numberType === type);
};

/**
 * Filters search expression options by type.
 *
 * @param {string} searchType Type of the search field.
 *
 * @returns {Object[]} List of search expressions, filtered by search field type.
 */
export const filterExpressionsByType = (searchType: string): Object[] => {
    const searchExpressions = [
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
        {
            value: 'NOT LIKE',
            label: strings.search.expression.notLike,
            types: ['string'],
        },
    ];

    return searchFieldIsNumber(searchType)
        ? searchExpressions.filter(expression => expression.types.some(type => type === 'number'))
        : searchExpressions.filter(expression => expression.types.some(type => type === 'string'));
};

/**
 * Creates queryString from searched values
 *
 * @param searchFieldValues Array containing all field search values
 * @param textSearch String from default text search
 * @param fields Array of all attributes included in featurelayer
 * @param queryColumnsList Array of columns that are queried on general search
 *
 * @returns Parsed querystring that can be passed to feature fetch URL
 */
export const parseQueryString = (
    searchFieldValues: Array<any>,
    textSearch: string,
    fields: Array<Object>,
    queryColumnsList: Array<string>,
) => {
    const queryString = [];

    if (searchFieldValues.length > 0) {
        searchFieldValues.forEach((searchFieldValue) => {
            const { queryExpression, type, name } = searchFieldValue;
            let { queryText, queryDate } = searchFieldValue;
            queryText = queryText.toString();
            queryDate = queryDate.toString();

            if (queryText.trim().length === 0 && queryDate.trim().length === 0) {
                if (queryExpression === 'NOT' || queryExpression === 'NOT LIKE') {
                    queryString.push(`${name} IS NOT NULL`);
                } else if (queryExpression !== '<' && queryExpression !== '>') {
                    queryString.push(`${name} IS NULL`);
                }
            } else if (searchFieldIsNumber(type)) {
                if (queryExpression === ('NOT')) {
                    queryString.push(`NOT ${name} = ${queryText.trim()} OR ${name} IS NULL`);
                } else {
                    queryString.push(`${name} ${queryExpression} ${queryText.trim()}`);
                }
            } else if (queryDate.trim().length > 0) {
                queryString.push(`CAST(SUBSTRING(${name},0,10) AS DATE) = DATE '${queryDate.trim()}'`);
            } else {
                const text = queryExpression === 'LIKE' || queryExpression === 'NOT LIKE'
                    ? `'%${queryText.trim().replace(/'/g, "''")}%'`
                    : `'${queryText.trim().replace(/'/g, "''")}'`;

                switch (queryExpression) {
                    case ('NOT'):
                        queryString.push(`NOT LOWER(${name}) = LOWER(${text}) OR ${name} IS NULL`);
                        break;
                    case ('NOT LIKE'):
                        queryString.push(`NOT LOWER(${name}) LIKE LOWER(${text}) OR ${name} IS NULL`);
                        break;
                    default:
                        queryString.push(`LOWER(${name}) ${queryExpression} LOWER(${text})`);
                }
            }
        });
    } else {
        const text = `'%${textSearch.replace(/'/g, "''")}%'`;
        queryColumnsList.forEach(queryColumn => queryString.push(`LOWER(${queryColumn}) LIKE LOWER(${text})`));
    }

    return searchFieldValues.length > 0 ? queryString.join(' AND ') : queryString.join(' OR ');
};

/**
 * Return options for Select -component.
 *
 * @param {Object[]} cv List of codedValues.
 * @returns {Array<{label: string, value: string|number}>} List of options.
 */
export const codedValueOptions: Function = (cv: Object[]) => cv.map(v => (({
    value: v.code,
    label: v.name,
})));
