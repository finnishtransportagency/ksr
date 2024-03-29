// @flow
import { toDisplayDate } from './date';
import { getCodedValue } from './parseFeatureData';

/**
 * Download CSV file.
 *
 * @param data {string} csv formated string.
 * @param tableName {string} Name of the file to download.
 */
export const download = (data: string, tableName: string) => {
    const blob = new Blob([data], {
        type: 'text/csv;charset=UTF-8',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('hidden', '');
    link.setAttribute('href', url);
    link.setAttribute('download', `${tableName}.csv`);
    const { body } = document;
    if (body) {
        body.appendChild(link);
        link.click();
        body.removeChild(link);
    }
};

/**
 * Convert table data to csv formated string.
 *
 * @param data {Object[]} Row data.
 * @param columns {Object[]} Column data.
 *
 * @returns {string} String in csv format.
 */
export const objectToCsv = (data: Object[], columns: Object[]): string => {
    const csvRows = [];
    csvRows.push(columns.map(c => c.Header).join(','));
    // loop over the rows
    data.map((row) => {
        const values = columns.map((c) => {
            const escaped = String(row[c.accessor]).replace(/(\r\n|\n|\r)/gm, ' ').replace(/"/g, '\\"');
            if (escaped === 'null') {
                return '""';
            }
            if (c.className === 'date') {
                return `"${toDisplayDate(Number(escaped))}"`;
            }
            if (c.domain !== null) {
                const codedValue = getCodedValue(c.domain, escaped, true);
                if (codedValue) {
                    return `"${codedValue}"`;
                }
            }
            return `"${escaped}"`;
        });
        return csvRows.push(values.join(','));
    });
    return csvRows.join('\n');
};
