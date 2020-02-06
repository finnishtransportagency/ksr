import styled from 'styled-components';
import * as styles from '../../../../../ui/defaultStyles';

export const SelectWrapper = styled.div`   
    .Select > .Select-control {
        border-color: ${({ invalid }) => (invalid
        ? `${styles.colorDanger} !important`
        : styles.colorBackgroundLightSecondary)};
    }
`;
