import styled from 'styled-components';

export const Wrapper = styled.div`
    #mapView {
        position: fixed;
        top: 0;
        left: 360px;
        z-index: -1;
        background: #ffffff;
        height: 100%;
        width: calc(100% - 360px);
    }
    
    .sassy-theme .esri-widget,
.sassy-theme .esri-widget-button,
.sassy-theme .esri-menu,
.sassy-theme .esri-popup__main-container,
.sassy-theme .esri-popup .esri-pointer-direction,
.sassy-theme .esri-button {
  background-color: #c69;
  color: #fff;
}

.sassy-theme .esri-widget-button:focus,
.sassy-theme .esri-widget-button:hover,
.sassy-theme .esri-menu li:focus,
.sassy-theme .esri-menu li:hover {
  background-color: #699;
  color: #fff;
}

.sassy-theme .esri-button:focus,
.sassy-theme .esri-button:hover {
  color: #fff;
}
`;
