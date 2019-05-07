import styled from 'styled-components';
import * as styles from '../defaultStyles';

export const Toast = styled.div`
    .Toastify__toast {
        font-family: 'Exo 2', Arial, sans-serif;
        background: #ffffff;
        color: #444;
        padding: 1em;
        box-shadow: ${styles.shadowDefault};
    };
    
    .Toastify__toast-body {
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .Toastify__toast-container--top-right {
        top: 0.7em;
        right: 4em;
        
        @media only screen and (max-width: 768px) {
            top: 0;
        }
    }
    
    .Toastify__progress-bar {
        height: 2px;
    };
    
    .Toastify__toast--success {
        border-left: 32px solid ${styles.colorSuccess};
        
        .Toastify__progress-bar {
            background: ${styles.colorSuccess};
        };
    };
    
    .Toastify__toast--info {
        border-left: 32px solid ${styles.colorInfo};
        
        .Toastify__progress-bar {
            background: ${styles.colorInfo};
        };
    };
    
    .Toastify__toast--error {
        border-left: 32px solid ${styles.colorDanger};
        
        .Toastify__progress-bar {
            background: ${styles.colorDanger};
        };
    };
`;
