# Matti Telenius       Sitowise Oy     2019

*** Settings ***
Documentation     Regression testcases for ksr
Resource          variables.robot

#Suite Setup       openmainpage
Suite Setup       openmainpageheadless
Suite Teardown    Close all Browsers

*** Variables ***
${IMAGE_DIR}      ${CURDIR}\\img
${search}         css=[class~='fa-search']
${layers}         css=[class~='fa-layer-group']
${print}          css=[class~='fa-print']
${workspace}      css=[class~='fa-briefcase']
${zoomin}         css=[class~='esri-icon-plus']
${zoomout}        css=[class~='esri-icon-minus']
${compass}        css=[class~='esri-compass__icon']
${locate}         css=[class~='esri-icon-locate']
${tracking}       css=[class~='esri-icon-tracking']
${measure}        css=[id='toggle-draw-tools']
${meas_line}      css=[id='draw-line']
${meas_poly}      css=[id='draw-polygon']
${meas_rem}       css=[id='remove-draw']
${draw}           css=[id='toggle-draw-tools']
${select}         css=[id='toggle-select-tools']
${detail}         css=[class~='fa-angle-up']
${closedet}       css=[class~='fa-angle-down']

*** Keywords ***

*** Test Cases ***
Avaa ksr
    [Tags]            smoke
    [Documentation]   Avaa sovelluksen
    run keyword and ignore error    Wait Until Element Is Not Visible   css=[class='loading-icon']   timeout=30
    location should contain   ${LOGIN URL}
    Wait Until Element Is Enabled    ${workspace}     timeout=30
    sleep    5
    click element                 ${workspace}
    click element                 ${workspace}

Avaa ksr valitse työtila
    [Tags]            smoke
    [Documentation]   Valitsee työtilan testi
    run keyword and ignore error    Wait Until Element Is Visible    css=[class='loading-icon']     timeout=5
    run keyword and ignore error    Wait Until Element Is Not Visible   css=[class='loading-icon']   timeout=30
    Wait Until Element Is Enabled    ${workspace}     timeout=30
    click element                 ${workspace}
    click element                 xpath=.//div[contains(text(), 'testi')]
    click element                 xpath=.//button[contains(text(), 'Avaa')]
    click element                 ${workspace}

Avaa ksr valitse karttataso
    [Tags]            smoke
    [Documentation]   Valitsee karttatasoja pois päältä ja testaa valinnan
    Wait Until Element Is Enabled    ${layers}     timeout=10
    Click Element        ${layers}
    wait until element is visible   css=div:nth-child(1) >div:nth-child(2) [class~='fa-toggle-on']
    click element        xpath=.//button[contains(text(), 'Kaikki')]
    click element        xpath=.//span[contains(text(), 'VESI')]
    click element        css=[value='Turvalaite']
    click element        xpath=.//button[contains(text(), 'Aktiiviset')]
    wait until element is enabled   xpath=.//button[contains(text(), 'Aktiiviset')]
    Selenium2Library.drag and drop by offset       xpath=.//*[@title="Turvalaite"]/../following-sibling::div/div/div[@class="rc-slider-step"]   -70   0
    click element        ${layers}

Valitse kohde kartalta ja avaa taulukko nakyma
    [Tags]            smoke1
    [Documentation]   Valitsee kunnan, tarkistaa sen taulukosta ja muokkaa sarakkeita
    Wait Until Element Is Enabled    ${workspace}     timeout=30
    wait until element is visible  css=[class='esri-view-root']
    mouse over    css=[class~='esri-ui']
    Selenium2Library.drag and drop by offset       css=[class~='esri-ui']     0    200
    click element        ${zoomin}
    mouse over    css=[class~='esri-ui']
    click element at coordinates   css=[class~='esri-ui']          0     0
    click element        ${detail}
    click element        css=[title='Poistuu']
    ${v} =   Selenium2Library.get text   css=div.rt-tbody > div > div > div:nth-child(1) > div > div:nth-child(5)
    should be equal      ${v}     RATA
    click element        css=[class~='fa-filter']
    click element        css=[title='VAYLATYYPPI']
    click element        xpath=.//button[contains(text(), 'Suodata')]
    ${v} =   Selenium2Library.get text   css=div.rt-tbody > div > div > div:nth-child(1) > div > div:nth-child(5)
    should not be equal      ${v}     RATA
    click element        ${closedet}
    click element        css=[class~='esri-icon-close']
    click element        css=[id='remove-selection']

Aluevalinta kartalta suorakulmion avulla
    [Tags]            smoke1
    [Documentation]   Valitse alue suorakulmio, lisää siihen puskurialue ja vertaa valittuja alueita
    run keyword and ignore error   click element        ${meas_rem}
    click element        ${select}
    click element        css=[id='draw-rectangle']
    Selenium2Library.drag and drop by offset       css=[class~='esri-ui']     200    200
    click element        ${detail}
    click element        css=[class~='fa-dot-circle']
    Selenium2Library.input text    css=label [type='number']   1204
    click element        xpath=.//div[button='Lisää']/button[1]
    click element        ${closedet}
    click element        css=[id='remove-selection']
    click element        ${select}

Aluevalinta ympyra kanssa
    [Tags]            smoke1
    [Documentation]   Valitse alue ympyra ja vertaa valittuja alueita, sekä tarkistaa taulusta tuloksen
    click element        ${select}
    click element        css=[id='draw-circle']
    Selenium2Library.drag and drop by offset       css=[class~='esri-ui']     200    200
    click element        ${detail}
    ${v} =   Selenium2Library.get text    css=div.rt-tbody > div > div > div:nth-child(1) > div > div:nth-child(5)
    should be equal      ${v}     RATA
    click element        ${closedet}
    click element        css=[id='remove-selection']
    click element        ${select}

Haku ikkunan kaytto
    [Tags]            smoke1
    [Documentation]   Hakee postinumeron perusteella ja tarkistaa taulusta että tulos on oikein
    click element        ${search}
    click element        xpath=.//label[contains(text(), 'Taso')]
    click_css            span.Select-arrow-zone
    send_down_key
    send_down_key
    send_down_key
    send_enter_key
    Selenium2Library.Input text   css=div.sidebar-content-scroll-inner > form > label:nth-child(3) > input     Salo
    click element        xpath=.//p[contains(text(), 'Lisää')]/../label/div/div/span
    send_enter_key
    Selenium2Library.Input text   css=[aria-autocomplete="list"]       Salon
    click element        css=form > button
    click element        ${detail}
    ${v} =   Selenium2Library.get text   css=div.rt-tbody > div > div > div:nth-child(1) > div > div:nth-child(3)
    should be equal      ${v}     Salon kaupunki
    click element        css=[class~='fa-trash']
    click element        xpath=.//div[button='Tyhjennä']/button[1]
    click element        ${closedet}
    click element        ${search}


Lisaa karttataso
    [Tags]            smoke1
    [Documentation]   Lisää karttatason ja poistaa sen
    Click Element        ${layers}
    click element        xpath=.//div[button='Uusi taso']/button[1]
    Selenium2Library.input text   css=[name='name']     Testi taso
    Selenium2Library.input text   css=[name='url']   https://services.arcgis.com/6G8plNyk35GEC5T4/ArcGIS/rest/services/oppilaitokset/FeatureServer
    Selenium2Library.input text   css=[name='queryColumns']   oppilaitokset
    click element        xpath=.//div[button='Lisää']/button[1]
    click element        ${layers}
    click element        ${layers}
    click element        css=button:nth-child(2)
    click element        xpath=.//div[span='Käyttäjätasot']
    click element        css=[class~='fa-trash']
    click element        xpath=.//div[button='Poista']/button[1]
    click element        ${layers}

