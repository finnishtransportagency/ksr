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
            const {
                queryExpression, type, name, queryText,
            } = searchFieldValue;

            if (queryText.trim().length === 0) {
                if (queryExpression === 'NOT' || queryExpression === 'NOT LIKE') {
                    queryString.push(`${name} is not null`);
                } else if (queryExpression !== '<' && queryExpression !== '>') {
                    queryString.push(`${name} is null`);
                }
            } else if (searchFieldIsNumber(type)) {
                if (queryExpression === ('NOT')) {
                    queryString.push(`NOT ${name} = ${queryText}`);
                } else {
                    queryString.push(`${name} ${queryExpression} ${queryText}`);
                }
            } else {
                const text = queryExpression === 'LIKE' || queryExpression === 'NOT LIKE'
                    ? `'%${queryText.replace(/'/g, "''")}%'`
                    : `'${queryText.replace(/'/g, "''")}'`;

                switch (queryExpression) {
                    case ('NOT'):
                        queryString.push(`NOT LOWER(${name}) = LOWER(${text})`);
                        break;
                    case ('NOT LIKE'):
                        queryString.push(`NOT LOWER(${name}) LIKE LOWER(${text})`);
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
