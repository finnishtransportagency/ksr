export const getHeaders = () => {
    const headers = new Headers();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return headers;
};

export const config = () => ({
    headers: getHeaders(),
    credentials: 'include',
});
