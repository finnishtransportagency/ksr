import { keyframes } from 'styled-components';

export const fadeInModal = keyframes`
    from {
        opacity: 0;
        margin-top: 0;
    } to {
        opacity: 1;
        margin-top: 2rem;
    }
`;

export const fadeOutModal = keyframes`
    from {
        opacity: 1;
        margin-top: 2rem;
    } to {
        opacity: 0;
        margin-top: 0;
    }
`;
