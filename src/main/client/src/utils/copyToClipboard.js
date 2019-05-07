// @flow

/**
 * Copy text to clipboard.
 *
 * @param {string} text Text to be copied.
 */
export const copyToClipboard = (text: string) => {
    const { body } = window.document;
    const el = document.createElement('textarea');

    el.value = text;
    body.appendChild(el);
    el.select();
    document.execCommand('copy');
    body.removeChild(el);
};
