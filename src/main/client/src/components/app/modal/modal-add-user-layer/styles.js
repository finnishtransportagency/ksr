import styled from 'styled-components';
import * as styles from '../../../ui/defaultStyles';
import Radiobutton from '../../../ui/blocks/Radiobutton';
import { InputInfo } from '../../../ui/elements/TextInput';

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

export const RadioWrapper = styled.div`
    padding: 1em;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
        ${Radiobutton} {
            margin-bottom: 1rem;
        };
`;

export const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    
        ${InputInfo} {
            top: 10rem;
            position: absolute;
            right: 1.56rem;
        };
`;
