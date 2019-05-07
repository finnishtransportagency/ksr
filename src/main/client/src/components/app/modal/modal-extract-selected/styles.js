import styled from 'styled-components';
import * as styles from '../../../ui/defaultStyles';
import { RadioWrapper } from '../../side-bar/search/styles';

export const ModalExtractSelectedWrapper = styled.div`
    @media only screen and (max-width: 768px) {
        ${RadioWrapper} {
            flex-direction: column;
            padding-top: 0;
            
            label {
                margin-bottom: 1rem;
            };
        };
    };
`;

export const OutputWrapper = styled.div`
    text-align: center;
    background-color: ${styles.colorBackgroundLight};
    padding: 1em;
    
    a {
        color: ${styles.colorMain};
        text-decoration: none;
        
        &:hover {
            text-decoration: underline;
        };
        
        i {
            font-size: 15px;
        };
        
        span {
            padding-left: 4px;
        };
    };
`;
