// @flow

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
        searchFieldValues.forEach((a) => {
            const expression = a.queryExpression === '%'
                ? 'LIKE'
                : a.queryExpression;

            const text = a.queryExpression === '%'
                ? `'%${a.queryText.replace(/'/g, "''")}%'`
                : `'${a.queryText.replace(/'/g, "''")}'`;

            queryString.push(`LOWER(${a.name}) ${expression} LOWER(${text})`);
        });
    } else {
        const text = `'%${textSearch.replace(/'/g, "''")}%'`;

        queryColumnsList.forEach(a => queryString.push(`LOWER(${a}) LIKE LOWER(${text})`));
    }

    return searchFieldValues.length > 0 ? queryString.join(' AND ') : queryString.join(' OR ');
};
