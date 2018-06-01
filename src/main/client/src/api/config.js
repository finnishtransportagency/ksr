export const getHeadersLayerGroup = () => {
    const headers = new Headers();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers.append('OAM_REMOTE_USER', 'test_user');
    headers.append('OAM_GROUPS', 'KSR_ROLE_USER');
    return headers;
};
