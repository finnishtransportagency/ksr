# Matti Telenius       Dimenteq Oy     2018

*** Settings ***
Documentation     Regression testcases for ksr
Resource          variables.robot
Library           SikuliLibrary     DISABLE_SIKULI_LOG='TRUE'  mode='NEW'

#Suite Setup       openmainpage
Suite Setup       openmainpageheadless
Suite Teardown    Close all Browsers

*** Variables ***
${IMAGE_DIR}      ${CURDIR}\\img

*** Keywords ***

*** Test Cases ***
Avaa ksr
    [Tags]            smoke
    [Documentation]   Avaa sovelluksen
    run keyword and ignore error    Wait Until Element Is Not Visible   css=[class='loading-icon']   timeout=30
    location should contain   ${LOGIN URL}
    Capture Page Screenshot
    Wait Until Element Is Enabled    css=[class~='fa-briefcase']     timeout=30
    click element                 css=[class~='fa-briefcase']
    click element                 css=[class~='fa-briefcase']

Avaa ksr valitse työtila
    [Tags]            map
    [Documentation]   Valitsee työtilan testi
    run keyword and ignore error    Wait Until Element Is Visible    css=[class='loading-icon']     timeout=5
    run keyword and ignore error    Wait Until Element Is Not Visible   css=[class='loading-icon']   timeout=30
    Wait Until Element Is Enabled    css=[class~='fa-briefcase']     timeout=30
    click element                 css=[class~='fa-briefcase']
    click element                 xpath=.//div[contains(text(), 'testi')]
    click element                 xpath=.//button[contains(text(), 'Avaa')]
    click element                 css=[class~='fa-briefcase']

Avaa ksr valitse karttataso
    [Tags]            map
    [Documentation]   Valitsee karttatasoja pois päältä ja testaa valinnan
    Wait Until Element Is Enabled    css=[class~='fa-layer-group']     timeout=10
    Click Element        css=[class~='fa-layer-group']
    wait until element is visible   css=div:nth-child(1) >div:nth-child(2) [class~='fa-toggle-on']
    start sikuli process
    Add Image Path    ${image_dir}
    log    ${image_dir}
    set min similarity  0.80    #0.9
    click element        xpath=.//div[contains(text(), 'Muinaisjäännökset')]/../following-sibling::div/div/div[@class="rc-slider-step"]
    wait until screen contain      muin2   15
    click element        xpath=.//div[contains(text(), 'Muinaisjäännökset')]/../../preceding-sibling::div/i[@class="fas fa-toggle-on"]
    click element        xpath=.//div[contains(text(), 'Rakennussuojelu')]/../../preceding-sibling::div/i[@class="fas fa-toggle-on"]
    wait until screen contain      par    12
    click element        xpath=.//div[contains(text(), 'Luonnonsuojelu')]/../../preceding-sibling::div/i[@class="fas fa-toggle-on"]
    log     ${CURDIR}${/}img
    Screen Should not Contain      par
    click element        css=[class~='fa-layer-group']

Kaanna karttaa
    [Tags]            map
    [Documentation]   Kääntää karttaa ja palauttaa kompassi suunnan
    selenium_extensions.Drag to    left  1316  451     #right
    screen should not contain      hank
    click element        css=[class~='esri-compass__icon']
    screen should contain   hank

Valitse kohde kartalta ja avaa taulukko nakyma
    [Tags]            map
    [Documentation]   Valitsee kunnan, tarkistaa sen taulukosta ja muokkaa sarakkeita
    Wait Until Element Is Enabled    css=[class~='fa-briefcase']     timeout=30
    sleep    5
    wait until element is visible  css=[class='esri-view-root']
    click element        css=[class~='esri-icon-plus']
    mouse over    css=[class~='esri-ui']
    click element at coordinates   css=[class~='esri-ui']        -25     25
    click element at coordinates   css=[class~='esri-ui']        -25     50
    click element        css=[class~='fa-angle-up']
    click element        css=[title='Kunnat']
    ${v} =   Selenium2Library.get text   css=div.rt-tbody > div > div > div:nth-child(1) > div > div:nth-child(4)
    should be equal      ${v}     Salo
    click element        css=[class~='fa-filter']
    click element        css=[id=Kunta]
    click element        css=#modal-root > div > div > button:nth-child(1)
    ${v} =   Selenium2Library.get text   css=div.rt-tbody > div > div > div:nth-child(1) > div > div:nth-child(4)
    should not be equal  ${v}     Salo
    click element        css=[class~='fa-angle-down']
    click element        css=[class~='esri-icon-close']
    click element        css=[id='remove-selection']

Piirra viiva kartalle
    [Tags]            map
    [Documentation]   Piirrä viiva ja tarkistaa pituuden
    click element        css=[id='toggle-measure-tools']
    click element        css=[id='draw-measure-line']
    click element at coordinates    css=[class~='esri-ui']     0    0
    set selenium speed   0
    click element at coordinates    css=[class~='esri-ui']    100   100
    click element at coordinates    css=[class~='esri-ui']    50    -50
    set selenium speed   0
    click element at coordinates    css=[class~='esri-ui']    -50    -50
    click element at coordinates    css=[class~='esri-ui']    -50    -50
    Set Selenium Speed   ${DELAY}
    screen should contain   48
    click element        css=[id='remove-measurement']
    click element        css=[id='toggle-measure-tools']

Piirra alue kartalle
    [Tags]            map
    [Documentation]   Piirrä alue ja tarkistaa onko ala oikein
    click element        css=[id='toggle-measure-tools']
    click element        css=[id='draw-measure-polygon']
    click element at coordinates    css=[class~='esri-ui']     0      0
    click element at coordinates    css=[class~='esri-ui']    100    100
    click element at coordinates    css=[class~='esri-ui']     50    -50
    set selenium speed   0
    click element at coordinates    css=[class~='esri-ui']    -50    -50
    click element at coordinates    css=[class~='esri-ui']    -50    -50
    Set Selenium Speed   ${DELAY}
    screen should contain   11
    click element        css=[id='remove-measurement']
    click element        css=[id='toggle-measure-tools']

Aluevalinta kartalta suorakulmion avulla
    [Tags]            map
    [Documentation]   Valitse alue suorakulmio, lisää siihen puskurialue ja vertaa valittuja alueita
    click element        css=[id='toggle-select-tools']
    click element        css=[id='draw-rectangle']
    SikuliLibrary.drag and drop by offset    vuo    100    150
    Wait Until Screen Contain    suorak      5
    click element        css=[class~='fa-angle-up']
    click element        css=[class~='fa-dot-circle']
    Selenium2Library.input text    css=label [type='number']   1204
    click element        xpath=.//div[button='Lisää']/button[1]
    click element        css=[class~='fa-angle-down']
    Wait Until Screen Contain    pusk      5
    click element        css=[id='remove-selection']
    click element        css=[id='toggle-select-tools']

Aluevalinta ympyra kanssa
    [Tags]            map
    [Documentation]   Valitse alue ympyra ja vertaa valittuja alueita, sekä tarkistaa taulusta tuloksen
    click element        css=[id='toggle-select-tools']
    click element        css=[id='draw-circle']
    SikuliLibrary.drag and drop by offset   vuo    200    150
    Wait Until Screen Contain    ymp   5
    click element        css=[class~='fa-angle-up']
    ${v} =   Selenium2Library.get text    css=div.rt-tbody > div > div > div:nth-child(1) > div > div:nth-child(6)
    should be equal      ${v}     Kruusila
    click element        css=[class~='fa-angle-down']
    click element        css=[id='remove-selection']
    click element        css=[id='toggle-select-tools']

Aluevalinta lasson kanssa
    [Tags]            map
    [Documentation]   Valitse alue lasso ja vertaa valittuja alueita
    run keyword and ignore error    Wait Until Element Is Visible    css=[class='loading-icon']     timeout=5
    run keyword and ignore error    Wait Until Element Is Not Visible   css=[class='loading-icon']   timeout=30
    sleep    10
    click element        css=[class~='esri-icon-plus']
    click element        css=[class~='esri-icon-plus']
    click element        css=[id='toggle-select-tools']
    click element        css=[id='draw-polygon-select']
    click element at coordinates    css=[class~='esri-ui']         0      0
    click element at coordinates    css=[class~='esri-ui']         100    100
    click element at coordinates    css=[class~='esri-ui']         50    -50
    click element at coordinates    css=[class~='esri-ui']         -50    -50
    set selenium speed   0
    doubleclick element at coordinates     css=[class~='esri-ui']         -50    -50
    doubleclick element at coordinates     css=[class~='esri-ui']         -50    -50
    click element at coordinates    css=[class~='esri-ui']         -50    -50
    click element at coordinates    css=[class~='esri-ui']         -50    -50
    click element at coordinates    css=[class~='esri-ui']         -50    -50
    click element at coordinates    css=[class~='esri-ui']         -50    -50
    click element at coordinates    css=[class~='esri-ui']         -50    -50
    click element at coordinates    css=[class~='esri-ui']         -50    -50
    click element at coordinates    css=[class~='esri-ui']         -50    -50
    click element at coordinates    css=[class~='esri-ui']         -50    -50
    Set Selenium Speed   ${DELAY}
    sleep   10
  #  Wait Until Screen Contain    lass   5
    click element        css=[id='remove-selection']
    click element        css=[id='toggle-select-tools']

Haku ikkunan kaytto
    [Tags]            map
    [Documentation]   Hakee postinumeron perusteella ja tarkistaa taulusta että tulos on oikein
    click element        css=[class~='fa-search']
    click_css            span.Select-arrow-zone
    send_down_key
    send_down_key
    send_down_key
    send_enter_key
    Selenium2Library.Input text   css=div.sidebar-content-scroll-inner > form > label:nth-child(3) > input     Salo
    click element        css=div > label span
    send_down_key
    send_down_key
    send_down_key
    send_enter_key
    Selenium2Library.Input text   css=[aria-autocomplete="list"]       24100
    click element        css=form > button
    click element        css=[class~='fa-angle-up']
    ${v} =   Selenium2Library.get text   css=div.rt-tbody > div > div > div:nth-child(1) > div > div:nth-child(6)
    should be equal      ${v}     Salo Keskus
    click element        css=[class~='fa-trash']
    click element        xpath=.//div[button='Tyhjennä']/button[1]
    click element        css=[class~='fa-angle-down']
    click element        css=[class~='fa-search']

Yllapito alue lisays karttaan
    [Tags]            map
    [Documentation]   Valitsee tason ja muokkaa sitä, piirtää alueen ja tallentaa, sitten poistaa kohteen
    click Element        css=[class~='fa-layer-group']
    Click Element        xpath=.//div[contains(text(), 'Turvalaitteet (VPN)')]/../div/i[@class="fas fa-edit"]
    click Element        css=[class~='fa-layer-group']
    ${t} =  Run Keyword And Ignore Error   element text should be    css=[class='esri-scale-bar__label']   10 km
    ${v} =  Run Keyword And Ignore Error   element text should be    css=[class='esri-scale-bar__label']   0.6 km
    run keyword if  '${t[0]}'=='FAIL' and '${v[0]}'=='FAIL'  click element          css=[class~='esri-icon-plus']
    click element        css=#draw-create-new-feature > [class~='esri-icon-polygon']
    click element at coordinates   css=[class~='esri-ui']         0      0
    click element at coordinates   css=[class~='esri-ui']         100    100
    click element at coordinates   css=[class~='esri-ui']         50    -50
    set selenium speed   0
    click element at coordinates   css=[class~='esri-ui']         -50    -50
    click element at coordinates   css=[class~='esri-ui']         -50    -50
    Set Selenium Speed   ${DELAY}
    click element        css=[class~='esri-icon-check-mark']
    Selenium2Library.input text     css=[name~='gml_id']      123
    Selenium2Library.input text     css=[name~='vuosi']      2018
    click element        xpath=.//div[button='Tallenna']/button[1]
    click Element        css=[class~='fa-layer-group']
    Click Element        css=div.layer-view-scroll-wrapper > div:nth-child(1) > div > div:nth-child(2) [class~='fa-edit']
    click Element        css=[class~='fa-layer-group']

Yllapito kentan muokkaus taulukosta
    [Tags]            map
    [Documentation]   Valitsee tason ja sieltä kohteen, muokkaa kenttää ja tallentaa
    click Element        css=[class~='fa-layer-group']
    Click Element        css=div.layer-view-scroll-wrapper > div:nth-child(1) > div > div:nth-child(2) [class~='fa-edit']
    click Element        css=[class~='fa-layer-group']
    ${t} =  Run Keyword And Ignore Error   element text should be    css=[class='esri-scale-bar__label']   10 km
    ${v} =  Run Keyword And Ignore Error   element text should be    css=[class='esri-scale-bar__label']   0.6 km
    run keyword if  '${t[0]}'=='FAIL' and '${v[0]}'=='FAIL'  click element          css=[class~='esri-icon-plus']
    # muokkaa kentän tietoja
    click element at coordinates   css=[class~='esri-ui']         100      100
    click element        css=[class~='fa-angle-up']
    ${v} =   Selenium2Library.get text   css=div.rt-tbody > div > div > div:nth-child(1) > div > div:nth-child(7)
    should not be equal  ${v}     Testi muutos
    Selenium2Library.input text     css=div.rt-tbody > div > div > div:nth-child(1) > div > div:nth-child(7) > div   Testi muutos
    click element        css=div.rt-tbody > div > div > div:nth-child(1) > div > div:nth-child(6)
    click element        css=div:nth-child(4) > [class~='fa-save']
    click element        xpath=.//div[button='Tallenna']/button[1]
    ${v} =   Selenium2Library.get text   css=div.rt-tbody > div > div > div:nth-child(1) > div > div:nth-child(7)
    should be equal      ${v}     Testi muutos
    click element        css=[class~='esri-icon-close']
    click Element        css=[class~='fa-layer-group']
    Click Element        css=div.layer-view-scroll-wrapper > div:nth-child(1) > div > div:nth-child(2) [class~='fa-edit']
    click Element        css=[class~='fa-layer-group']
    click element             css=[class~='fa-angle-down']

Yllapito poista valittu kohde
    [Tags]            map
    [Documentation]   Valitsee jonkin kohteen ja poistaa sen
    click Element        css=[class~='fa-layer-group']
    Click Element        css=div.layer-view-scroll-wrapper > div:nth-child(1) > div > div:nth-child(2) [class~='fa-edit']
    click Element        css=[class~='fa-layer-group']
    ${t} =  Run Keyword And Ignore Error   element text should be    css=[class='esri-scale-bar__label']   10 km
    ${v} =  Run Keyword And Ignore Error   element text should be    css=[class='esri-scale-bar__label']   0.6 km
    run keyword if  '${t[0]}'=='FAIL' and '${v[0]}'=='FAIL'  click element          css=[class~='esri-icon-plus']
    # poistaa valitun kohteen
    click element at coordinates    css=[class~='esri-ui']         -100      -100
    click element             css=[class~='fa-angle-up']
    click element        css=[class~='fa-eraser']
    Selenium2Library.input text    css=[id~='comment']      Testi pois
    click element        xpath=.//div[button='Poista']/button[1]
    click element        css=[class~='fa-angle-down']
    click element        css=[title="Sulje"]

Lisaa karttataso
    [Tags]            map
    [Documentation]   Lisää karttatason ja poistaa sen
    Click Element        css=[class~='fa-layer-group']
    click element        xpath=.//div[button='Uusi taso']/button[1]
    Selenium2Library.input text   css=[name='name']     Testi taso
    click_css            span.Select-arrow
    send_enter_key
    Selenium2Library.input text   css=[name='url']   https://services.arcgis.com/6G8plNyk35GEC5T4/ArcGIS/rest/services/oppilaitokset/FeatureServer
    Selenium2Library.input text   css=[name='layers']   oppilaitokset
    click element        xpath=.//div[button='Lisää']/button[1]
    click element        css=[class~='fa-layer-group']
    screen Should Contain   oppi2
    click element        css=[class~='fa-layer-group']
    click element        css=button:nth-child(2)
    click element        xpath=.//div[span='Käyttäjätasot']
    click element        css=[class~='fa-trash']
    click element        xpath=.//div[button='Poista']/button[1]
    click element        css=[class~='fa-layer-group']

Tulosta alue
    [Tags]            map
    [Documentation]   Vie näkyvän alueen halutulla formaatilla tiedostoon, mikä on tulostettavissa
    Selenium2Library.Click Element    css=[class~='fa-layer-group']
    Selenium2Library.Click Element    css=button:nth-child(2)
    Selenium2Library.Click Element    css=div.layer-view-scroll-wrapper > div:nth-child(1) > div:nth-child(1)
    :for   ${i}  in range  1  5
     \  Selenium2Library.Click Element   css=[id="${i}"]
    Selenium2Library.Click Element    css=div.layer-view-scroll-wrapper > div:nth-child(1) > div:nth-child(2)
    :for   ${i}  in range  5   8
      \  Selenium2Library.Click Element   css=[id="${i}"]
    Selenium2Library.Click Element    css=div.layer-view-scroll-wrapper > div:nth-child(1) > div:nth-child(3)
    Selenium2Library.Click Element    css=[id="8"]
    Selenium2Library.Click Element    css=[class~='fa-print']
    Selenium2Library.Input text       css=[data-input-name='title']     test
    Selenium2Library.Click Element    css=[class~='esri-print__export-button']
    Wait Until Element Is Enabled     css=[class~='esri-print__exported-file-link-title']      timeout=30
    Wait Until Keyword Succeeds   10x  6  Selenium2Library.Click Element   css=[class~='esri-print__exported-file-link-title']
    run keyword and ignore error      screen Should not Contain     xwin
    screen Should Contain             test
    SikuliLibrary.Click               ksr
    Selenium2Library.Click Element    css=[class~='fa-print']

