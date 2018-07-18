import styled from 'styled-components';
import * as styles from '../../defaultStyles';

const Header = styled.div`
    position: relative;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    background: #FFFFFF;
    border-top: 6px solid ${styles.colorMain};
    
    button {
        background: none;
        border: none;
        
        &:hover {
            cursor: pointer;
        }
        
        &:focus {
            outline: none;
        }
    }
`;

export default Header;
