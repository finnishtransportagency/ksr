import { keyframes } from 'styled-components';

export const fadeInModal = keyframes`
    from {
        opacity: 0;
        top: 0;
    } to {
        opacity: 1;
        top: 2rem;
    }
`;

export const fadeOutModal = keyframes`
    from {
        opacity: 1;
        top: 2rem;
    } to {
        opacity: 0;
        top: 0;
    }
`;
