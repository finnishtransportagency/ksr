// @flow

/**
 * Creates queryString from searched values
 *
 * @param searchFieldValues Array containing all field search values
 * @param textSearch String from default text search
 * @param fields Array of all attributes included in featurelayer
 *
 * @returns Parsed querystring that can be passed to feature fetch URL
 */
export const parseQueryString = (
    searchFieldValues: Array<any>,
    textSearch: string,
    fields: Array<Object>,
) => {
    const queryString = [];

    if (searchFieldValues.length > 0) {
        searchFieldValues.forEach((a) => {
            const expression = a.queryExpression === '%'
                ? 'LIKE'
                : a.queryExpression;

            const text = a.queryExpression === '%'
                ? `%27%25${a.queryText}%25%27`
                : `%27${a.queryText}%27`;

            queryString.push(`${a.name}+${escape(expression)}+${text}`);
        });
    } else {
        const text = `%27%25${textSearch}%25%27`;

        // TODO: get default search attributes from database (layer: QUERY_COLUMNS)
        fields.forEach(a =>
            queryString.push(`${a.label}+LIKE+${text}`));
    }

    return searchFieldValues.length > 0 ? queryString.join('+AND+') : queryString.join('+OR+');
};
