import styled from 'styled-components';
import * as styles from '../../../../ui/defaultStyles';

export const InputInfo = styled.div`
    position: absolute;
    font-size: 1.5rem;
    right: 0.6rem;
    top: 0.3rem;
    color: ${styles.colorMain};
`;

export const InputWrapper = styled.div`
    position: relative; 
    background: ${styles.colorBackgroundLight};
    margin-bottom: 1rem;
    
    input {
        margin: 0;
        width: calc(100% - 3rem);
    }
    
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
    }
    
    input[type=number] {
        -moz-appearance: textfield;
    }
    
    .Select-control {
        &:hover {
            cursor: pointer;
        }
    }
    
    .Select-control > *:last-child {
        padding-right: 3rem;
    }
`;

export const SliderWrapper = styled.div`
    .rc-slider {
        cursor: default;
        margin: 1rem 0.5rem;
        width: calc(100% - 1rem);
    
        .rc-slider-track {
            background: ${styles.colorMain};
        }
        
        .rc-slider-rail {
            background: ${styles.colorBackgroundLight};
            cursor: default;
        }
        
        .rc-slider-handle {
            border: 2px solid ${styles.colorMain};
            background: ${styles.colorBackgroundLight};
            cursor: default;
        }
    }
`;
