import { createGlobalStyle } from 'styled-components';

// Colors
export const colorMain = '#00b0f5';
export const colorMainLight = '#49c2f1';
export const colorMainDark = '#009ae1';


export const colorFontDark = '#444444';
export const colorFontLight = '#F1F1F1';
export const colorFontDisabled = '#97999B';

export const colorBackgroundLight = '#F1F1F1';
export const colorBackgroundLightSecondary = '#c8c8c8';
export const colorBackgroundGrey = '#97999b';
export const colorBackgroundWhite = '#FFFFFF';
export const colorBackgroundDark = '#444444';
export const colorBackgroundDarkSecondary = '#4B4B4B';

export const colorFeatureHighlight = '#00DDFF';

export const colorTableEdited = '#F79421';
export const colorTableSelected = 'rgba(1, 176, 245, 0.25)';

export const colorDanger = '#CC3300';
export const colorSuccess = '#8DCB6D';
export const colorInfo = '#00b0CC';

export const extentGraphic = 'rgba(255, 0, 0, 0.50)';

// Shadows
export const shadowDefault = '0 2px 4px 0 hsla(0, 0%, 0%, 0.4)';
export const shadowDark = '0 2px 6px 0 hsla(0, 0%, 0%, 0.6)';
export const shadowInset = 'inset 0 2px 4px 0 hsla(0, 0%, 0%, 0.1)';

// Global Styles
export const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        font-family: 'Exo 2', Arial, sans-serif;
        font-weight: 400;
        font-size: 16px;
      
        background: ${colorBackgroundLight};
        color: ${colorFontDark};
        
        input, select, textarea, button {
            font-family: inherit;
        };
        
        *::selection, *::-moz-selection { 
            background: ${colorMain}; 
        };
    };
    
    .Select-clear-zone {
        font-family: Arial, sans-serif;
    };
`;
