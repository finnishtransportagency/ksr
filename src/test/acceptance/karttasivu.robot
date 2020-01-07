# Matti Telenius       Sitowise      2018

*** Settings ***
Documentation     Regression testcases for ksr
Resource          variables.robot
Library           SikuliLibrary     DISABLE_SIKULI_LOG='TRUE'  mode='NEW'

Suite Setup       openmainpage
#Suite Setup       openmainpageheadless
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
    [Tags]            test
    [Documentation]   Avaa sovelluksen
    run keyword and ignore error    Wait Until Element Is Visible    css=[class='loading-icon']     timeout=5
    run keyword and ignore error    Wait Until Element Is Not Visible   css=[class='loading-icon']   timeout=20
    location should contain   ${LOGIN URL}
    Wait Until Element Is Enabled    ${workspace}     timeout=30
    click element                 ${workspace}
    click element                 ${workspace}
    start sikuli process
    Add Image Path    ${image_dir}
    log    ${image_dir}
    set min similarity  0.85    #0.9

Avaa ksr valitse työtila
    [Tags]            test
    [Documentation]   Valitsee työtilan testi
    Wait Until Element Is Enabled    ${workspace}     timeout=30
    ${css} =        Get WebElement     css=[title='Taustakartta']
    ${prop_val} =   Call Method       ${css}    value_of_css_property    background-color
    ${b} =   run keyword and return status      should contain     ${prop_val}    176
    run keyword if      ${b} == False     click element                 css:[title='Taustakartta']
    click element                 ${workspace}
    ${c} =   get element count   css=[class='fas fa-save']
    ${n} =   get element count   xpath=.//div[contains(text(), 'testi')]
#    run keyword if  ${c} >0 and ${n} > 0   poista tila
    FOR   ${i}  IN RANGE  9
    \  click element                 ${zoomout}
    \  ${tt} =   SeleniumLibrary.get text   css=[class='esri-scale-bar__label']
    \  ${v} =  run keyword and return status   should be equal  ${tt}  4 km
    \  exit for loop if   ${v}
    SeleniumLibrary.Input text   css=[class='esri-search__form'] input   salo
    click element                 css=[class='esri-icon-search']
    FOR   ${i}  IN RANGE  9
#    \  wheel up     1
    \  click element                 ${zoomin}
    \  ${tt} =   SeleniumLibrary.get text   css=[class='esri-scale-bar__label']
    \  ${v} =  run keyword and return status   should be equal  ${tt}  1 km
    \  exit for loop if   ${v}
   # click element                 ${zoomin}
    run keyword if  ${c} >0 and ${n} > 0   Korvaa tila   ELSE   Luo tila
    click element                 xpath=.//div[contains(text(), 'testi')]
    click element                 xpath=.//button[contains(text(), 'Avaa')]
    click element                 ${workspace}

Avaa ksr valitse karttataso
    [Tags]            test
    [Documentation]   Valitsee karttatasoja pois päältä ja testaa valinnan
    Wait Until Element Is Enabled    ${layers}     timeout=10
    Click Element        ${layers}
    wait until element is visible   css=div:nth-child(1) >div:nth-child(1) [class~='fa-toggle-on']
    click element        xpath=.//button[contains(text(), 'Kaikki')]
    click element        xpath=.//span[contains(text(), 'rakennukset')]
    click element        css=[value='Poistuu']
    click element        xpath=.//span[contains(text(), 'Vesi')]
    click element        css=[value='Turvalaite']
    wait until screen contain      turv   15
    #locate               turv
    click element        xpath=.//button[contains(text(), 'Aktiiviset')]
    SeleniumLibrary.drag and drop by offset       xpath=.//*[@title="Turvalaite"]/../following-sibling::div/div/div[@class="rc-slider-step"]   -70   0
    #click element        xpath=.//*[@title="Turvalaite"]/../following-sibling::div/div/div[@class="rc-slider-step"]
    #wait until screen contain      turvh   15
    #locate               turvh
    screen should not contain      turv
    click element        ${layers}

Kaanna karttaa
    [Tags]            test
    [Documentation]   Kääntää karttaa ja palauttaa kompassi suunnan
    selenium_extensions.Drag to    left  1316  451     #right
    screen should not contain      salo
    click element        ${compass}
    screen should contain   salo

Valitse kohde kartalta ja avaa taulukko nakyma
    [Tags]            test
    [Documentation]   Valitsee kunnan, tarkistaa sen taulukosta ja muokkaa sarakkeita
    Wait Until Element Is Enabled    ${workspace}     timeout=30
    sleep    5
    wait until element is visible  css=[class='esri-view-root']
    mouse over    css=[class~='esri-ui']
   # selenium_extensions.Drag to    right   1000   500
  #  SeleniumLibrary.drag and drop by offset       css=[class~='esri-ui']     0    200
    SikuliLibrary.click        tusa
    click element        ${zoomin}
    mouse over    css=[class~='esri-ui']
    click element at coordinates   css=[class~='esri-ui']          0     20
    click element        ${detail}
    click element        css=[title='Turvalaite']
    ${v} =   SeleniumLibrary.get text   css=div.rt-tbody > div:nth-child(1) > div > div:nth-child(3) > div
    should be equal      ${v}     Salon kaupunki
    click element        css=[class~='fa-filter']
    click element        css=[title='Omistaja']
    click element        xpath=.//button[contains(text(), 'Suodata')]
    ${v} =   SeleniumLibrary.get text   css=div.rt-tbody > div:nth-child(1) > div > div:nth-child(3) > div
    should not be equal      ${v}     Salon kaupunki
    click element        ${closedet}
    click element        css=[class~='esri-icon-close']
    click element        css=[id='remove-selection']

Piirra viiva kartalle
    [Tags]            test
    [Documentation]   Piirrä viiva ja tarkistaa pituuden
    click element        ${measure}
    click element        ${meas_line}
    click element at coordinates    css=[class~='esri-ui']     0    0
    set selenium speed   0
    click element at coordinates    css=[class~='esri-ui']    100   100
    click element at coordinates    css=[class~='esri-ui']    50    -50
    set selenium speed   0
    click element at coordinates    css=[class~='esri-ui']    -50    -50
    click element at coordinates    css=[class~='esri-ui']    -50    -50
    Set Selenium Speed   ${DELAY}
    doubleclick element at coordinates     css=[class~='esri-ui']         -50    -50
    screen should contain   26
    click element        ${meas_rem}
    click element        ${measure}

Piirra alue kartalle
    [Tags]            test
    [Documentation]   Piirrä alue ja tarkistaa onko ala oikein
    run keyword and ignore error   click element        ${meas_rem}
    click element        ${select}
    click element        ${measure}
    click element        ${meas_poly}
    click element at coordinates    css=[class~='esri-ui']     0      0
    click element at coordinates    css=[class~='esri-ui']    100    100
    click element at coordinates    css=[class~='esri-ui']     50    -50
    set selenium speed   0
  #  click element at coordinates    css=[class~='esri-ui']    -50    -50
    click element at coordinates    css=[class~='esri-ui']    -50    -50
    Set Selenium Speed   ${DELAY}
    doubleclick element at coordinates     css=[class~='esri-ui']         -50    -50
    screen should contain   20
    click element        ${meas_rem}
    click element        ${measure}

Aluevalinta kartalta suorakulmion avulla
    [Tags]            test
    [Documentation]   Valitse alue suorakulmio, lisää siihen puskurialue ja vertaa valittuja alueita
    run keyword and ignore error   click element        ${meas_rem}
    click element        ${select}
    click element        css=[id='draw-rectangle']
    SikuliLibrary.drag and drop by offset    lo    350    350
    Wait Until Screen Contain    sval      5
    click element        ${detail}
    click element        css=[class~='fa-dot-circle']
    SeleniumLibrary.input text    css=label [type='number']   1204
    click element        xpath=.//div[button='Lisää']/button[1]
    click element        ${closedet}
    Wait Until Screen Contain    spusk      5
    click element        css=[id='remove-selection']
    click element        ${select}

Aluevalinta ympyra kanssa
    [Tags]            test
    [Documentation]   Valitse alue ympyra ja vertaa valittuja alueita, sekä tarkistaa taulusta tuloksen
    click element        ${select}
    click element        css=[id='draw-circle']
    SikuliLibrary.drag and drop by offset   lo    350    350
    Wait Until Screen Contain    sval   5
    click element        ${detail}
    ${v} =   SeleniumLibrary.get text    css=div.rt-tbody > div:nth-child(1) > div > div:nth-child(3) > div
    should be equal      ${v}     Salon kaupunki
    click element        ${closedet}
    click element        css=[id='remove-selection']
    click element        ${select}

Aluevalinta lasson kanssa
    [Tags]            test
    [Documentation]   Valitse alue lasso ja vertaa valittuja alueita
#    run keyword and ignore error    Wait Until Element Is Visible    css=[class='loading-icon']     timeout=5
#    run keyword and ignore error    Wait Until Element Is Not Visible   css=[class='loading-icon']   timeout=30
    click element        ${select}
    click element        css=[id='draw-polygon-select']
    click element at coordinates    css=[class~='esri-ui']         0      0
    click element at coordinates    css=[class~='esri-ui']        -100    100
    click element at coordinates    css=[class~='esri-ui']         50     50
    click element at coordinates    css=[class~='esri-ui']         40     70
    set selenium speed   0
  #click element at coordinates    css=[class~='esri-ui']         0     60
    doubleclick element at coordinates     css=[class~='esri-ui']         0    60
    Wait Until Screen Contain    sval   5               #lass   5
    Set Selenium Speed   ${DELAY}
    click element        css=[id='remove-selection']
    click element        ${select}

Haku ikkunan kaytto
    [Tags]            test
    [Documentation]   Hakee omistajann perusteella ja tarkistaa taulusta että tulos on oikein
    click element        ${search}
    click element        xpath=.//label[contains(text(), 'Taso')]
    click_css            span.Select-arrow-zone
    send_down_key
    send_down_key
    send_down_key
    send_enter_key
    SeleniumLibrary.Input text   css=[name="allFields"]    Salo
    click element        xpath=.//p[contains(text(), 'Lisää')]/../div/div/span
    send_enter_key
    SeleniumLibrary.Input text   css=[aria-autocomplete="list"]    Salon kaupunki
    click element        css=form > button
    click element        ${detail}
    ${v} =   SeleniumLibrary.get text   css=div.rt-tbody > div:nth-child(1) > div > div:nth-child(3) > div
    should be equal      ${v}     Salon kaupunki
    click element        css=[class~='fa-trash']
    click element        xpath=.//div[button='Tyhjennä']/button[1]
    click element        ${closedet}
    click element        ${search}

Yllapito alue lisays karttaan
    [Tags]            test
    [Documentation]   Valitsee tason ja muokkaa sitä, piirtää alueen ja tallentaa, sitten poistaa kohteen
    wait until element is visible        ${layers}
    click Element        ${layers}
    Click Element        xpath=.//span[contains(text(), 'Poistuu')]/../../../../div/i[starts-with(@class, 'fas fa-edit')]
    click Element        ${layers}
    ${t} =  Run Keyword And Ignore Error   element text should be    css=[class='esri-scale-bar__label']   10 km
    ${v} =  Run Keyword And Ignore Error   element text should be    css=[class='esri-scale-bar__label']   0.6 km
    run keyword if  '${t[0]}'=='FAIL' and '${v[0]}'=='FAIL'  click element          ${zoomin}
    click element        css=#draw-create-new-feature > [class~='esri-icon-polygon']
    click element at coordinates   css=[class~='esri-ui']         0      0
    click element at coordinates   css=[class~='esri-ui']         100    100
    click element at coordinates   css=[class~='esri-ui']         50    -50
    set selenium speed   0
    click element at coordinates   css=[class~='esri-ui']         -50    -50
    click element at coordinates   css=[class~='esri-ui']         -50    -50
    doubleclick element at coordinates     css=[class~='esri-ui']   -50    -50
     Set Selenium Speed   ${DELAY}
    click element        css=[class~='esri-icon-check-mark']
    SeleniumLibrary.input text     css=[name='ID']      123
    SeleniumLibrary.input text     css=[name='HUOMIO']      testi
    click element        xpath=.//div[button='Luo']/button[1]
    click Element        ${layers}
    wait until element is visible    xpath=.//span[contains(text(), 'Poistuu')]/../../../../div/i[starts-with(@class, 'fas fa-edit')]
    Click Element        xpath=.//span[contains(text(), 'Poistuu')]/../../../../div/i[starts-with(@class, 'fas fa-edit')]
    click Element        ${layers}

Yllapito kentan muokkaus taulukosta
    [Tags]            test
    [Documentation]   Valitsee tason ja sieltä kohteen, muokkaa kenttää ja tallentaa
    click Element        ${layers}
    Click Element        xpath=.//span[contains(text(), 'Poistuu')]/../../../../div/i[starts-with(@class, 'fas fa-edit')]
    click Element        ${layers}
    ${t} =  Run Keyword And Ignore Error   element text should be    css=[class='esri-scale-bar__label']   10 km
    ${v} =  Run Keyword And Ignore Error   element text should be    css=[class='esri-scale-bar__label']   0.6 km
    run keyword if  '${t[0]}'=='FAIL' and '${v[0]}'=='FAIL'  click element          ${zoomin}
    # muokkaa kentän tietoja
    click element at coordinates   css=[class~='esri-ui']         100      100
    click element        ${detail}
    ${v} =   SeleniumLibrary.get text   css=div.rt-tbody > div:nth-child(1) > div > div:nth-child(3) > div
    should not be equal  ${v}     Testi muutos
    SeleniumLibrary.input text     css=div.rt-tbody > div:nth-child(1) > div > div:nth-child(3) > div   Testi muutos
    click element        css=div.rt-tbody > div:nth-child(1) > div > div:nth-child(6)
    click element        css=[class~='fa-save']
    click element        xpath=.//div[button='Tallenna']/button[1]
    ${v} =   SeleniumLibrary.get text   css=div.rt-tbody > div:nth-child(1) > div > div:nth-child(3)
    should be equal      ${v}     Testi muutos
    click element        css=[class='esri-popup__icon esri-icon-close']
    click Element        ${layers}
    Click Element        xpath=.//span[contains(text(), 'Poistuu')]/../../../../div/i[starts-with(@class, 'fas fa-edit')]
    click Element        ${layers}
    click element        ${closedet}

Yllapito poista valittu kohde
    [Tags]            test
    [Documentation]   Valitsee jonkin kohteen ja poistaa sen
    click Element        ${layers}
    Click Element        xpath=.//span[contains(text(), 'Poistuu')]/../../../../div/i[starts-with(@class, 'fas fa-edit')]
    click Element        ${layers}
    ${t} =  Run Keyword And Ignore Error   element text should be    css=[class='esri-scale-bar__label']   10 km
    ${v} =  Run Keyword And Ignore Error   element text should be    css=[class='esri-scale-bar__label']   0.6 km
    run keyword if  '${t[0]}'=='FAIL' and '${v[0]}'=='FAIL'  click element          ${zoomin}
    # poistaa valitun kohteen
    click element at coordinates    css=[class~='esri-ui']         -100      -100
    click element             ${detail}
    click element        css=[class~='fa-eraser']
    SeleniumLibrary.input text    css=[id~='comment']      Testi pois
    click element        xpath=.//div[button='Poista']/button[1]
    click element        ${closedet}

Lisaa karttataso
    [Tags]            test
    [Documentation]   Lisää karttatason ja poistaa sen
    Click Element        ${layers}
    click element        xpath=.//div[button='Uusi taso']/button[1]
    SeleniumLibrary.input text   css=[name='name']     Testi taso
   #click_css            span.Select-arrow
   #send_enter_key
    SeleniumLibrary.input text   css=[name='url']   https://services.arcgis.com/6G8plNyk35GEC5T4/ArcGIS/rest/services/oppilaitokset/FeatureServer/0
    SeleniumLibrary.input text   css=[name='queryColumns']   oppilaitokset
    click element        xpath=.//div[button='Lisää']/button[1]
    click element        ${layers}
  #  screen Should Contain   oppi2
    click element        ${layers}
    click element        css=button:nth-child(2)
    click element        xpath=.//div[span='Käyttäjätasot']
    click element        css=[class~='fa-trash']
    click element        xpath=.//div[button='Poista']/button[1]
    click element        ${layers}

Tulosta alue
    [Tags]            test
    [Documentation]   Vie näkyvän alueen halutulla formaatilla tiedostoon, mikä on tulostettavissa

     SeleniumLibrary.Click Element    ${layers}
     click element        xpath=.//button[contains(text(), 'Aktiiviset')]
     SeleniumLibrary.Click Element    xpath=.//span[contains(text(), 'Poistuu')]/../../../../../../div/i[@class="fas fa-toggle-on"]

    SeleniumLibrary.Click Element    ${print}
    SeleniumLibrary.Input text       css=[data-input-name='title']     test
    SeleniumLibrary.Click Element    css=[class~='esri-print__export-button']
    Wait Until Element Is Enabled     css=[class~='esri-print__exported-file-link-title']      timeout=30
    Wait Until Keyword Succeeds   10x  6  SeleniumLibrary.Click Element   css=[class~='esri-print__exported-file-link-title']

    ${e} =   get window titles
    ${e} =   convert to string    ${e}
    should contain    ${e}    undefined
    select window   NEW
    close window
    select window    MAIN
    SeleniumLibrary.Click Element    ${print}

Poista työtila
    [Tags]            test
    [Documentation]   Poistaa työtilan testi
    click element       ${workspace}
    Poista tila

*** Keywords ***
Poista tila
    click element       xpath=.//div[starts-with(@title, 'testi')]/../div[@title="Poista työtila"]
    click element       xpath=.//div[button='Poista']/button[1]

Luo tila
    click element                 xpath=.//button[contains(text(), 'Luo')]
    SeleniumLibrary.Input text   css=[for="Työtilan nimi"] div input   testi
    click element                 xpath=.//div[button='Tallenna']/button[1]

Korvaa tila
    click element       css=[class="fas fa-save"]
    click element       xpath=.//button[contains(text(), 'Korvaa')]
