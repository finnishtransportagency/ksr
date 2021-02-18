import styled from 'styled-components';
import { InputInfo } from '../../../../ui/elements/TextInput';
import * as styles from '../../../../ui/defaultStyles';

export const LabelInfoWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    ${InputInfo} {
        position: relative;
        color: #FFFFFF;
        right: initial;
        top: initial;
    };
`;

export const StyledSearchResultLayer = styled.div`
    background: ${styles.colorBackgroundLight};
    color: ${styles.colorFontDark};
    display: flex;
    flex-direction: row;
    justify-content: start;
    -webkit-box-shadow: ${styles.shadowDefault};
    -moz-box-shadow: ${styles.shadowDefault};
    box-shadow: ${styles.shadowDefault};
    border-left: 5px solid transparent;
    margin: 1rem 0;
    
    & > div {
        margin: 1rem;
    }
    
    &:hover {
        cursor: pointer;
        color: ${styles.colorMainDark};
    }
    
`;
