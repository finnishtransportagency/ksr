import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';

const Icon = styled.i`
    width: 30px;
    margin-right: ${props => props.edit && '1rem'};
        
    &:hover {
        color: ${styles.colorBackgroundDarkBlue};
        cursor: pointer;
    };
    
    ${({ unlink }) => unlink && css`
        margin-left: 1rem;
        
        &:hover {
            color: ${styles.colorDanger};
        };
    `};
    
    ${({ disabled }) => disabled && css`
        color: ${styles.colorFontDisabled};
        
        &:hover {
            color: ${styles.colorFontDisabled};
            cursor: default;
        };
    `};
`;

export default Icon;
