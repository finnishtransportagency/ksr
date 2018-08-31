# Matti Telenius       Dimenteq Oy     2018

*** Settings ***
Documentation     Regression testcases for ksr
Resource          variables.robot
Library           SikuliLibrary     DISABLE_SIKULI_LOG='TRUE'  mode='NEW'

Suite Setup       openmainpage
Suite Teardown    Close all Browsers

*** Variables ***
${IMAGE_DIR}      ${CURDIR}\\img

*** Keywords ***

*** Test Cases ***

Avaa ksr valitse karttataso
    [Tags]            smoke
    [Documentation]   Valitsee karttatasoja pois päältä ja testaa valinnan
 #   click_element        css=#root > div.sc-brqgnP.eiaVtq > div.sc-jWBwVP.cJvQXC > div:nth-child(1) > div:nth-child(2) > i

    Click Element        css=[class~='fa-map']
    wait until element is visible   css=div:nth-child(1) >div:nth-child(5) [class~='fa-toggle-on']
    start sikuli process
    Add Image Path    ${image_dir}
    log    ${image_dir}
    set min similarity  0.9    #0.8
    click element        css=div:nth-child(1) >div:nth-child(6) [class~='rc-slider-step']
    wait until screen contain      muin2   15
    screen Should not Contain      xwin
    click element        css=div:nth-child(1) >div:nth-child(6) [class~='fa-toggle-on']
    click element        css=div:nth-child(1) >div:nth-child(4) [class~='fa-toggle-on']
    wait until screen contain      par    12
    click element        css=div:nth-child(1) >div:nth-child(7) [class~='fa-toggle-on']
    log     ${CURDIR}
    log     ${CURDIR}${/}img
    Screen Should not Contain      par
    click element        css=[class~='fa-map']

Kaanna karttaa
    [Tags]            smoke
    [Documentation]   Kääntää karttaa ja palauttaa kompassi suunnan
    wait until screen contain      lohj    10
    mouse move           lohj
    selenium_extensions.Drag to    left  1316  451      #right
    screen should not contain      hank
    click element        css=[class~='esri-compass__icon']
    screen should contain   hank

Valitse kohde kartalta ja avaa taulukko nakyma
    [Tags]            smoke
    [Documentation]   Valitsee kunnan, tarkistaa sen taulukosta ja muokkaa sarakkeita
    wait until element is visible  css=[class='esri-view-root']
    click element        css=[class~='esri-icon-plus']
    click element at coordinates   css=[class~='esri-ui']         0     0
    click element        css=[class~='fa-angle-up']
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
    [Tags]            smoke
    [Documentation]   Piirrä viiva ja tarkistaa pituuden
    click element        css=[id='toggle-draw-tools']
    click element        css=[id='draw-line']
    click element at coordinates    css=[class~='esri-ui']     0    0
    set selenium speed   0
    click element at coordinates    css=[class~='esri-ui']    100   100
    click element at coordinates    css=[class~='esri-ui']    50    -50
    set selenium speed   0
    click element at coordinates    css=[class~='esri-ui']    -50    -50
    click element at coordinates    css=[class~='esri-ui']    -50    -50
    Set Selenium Speed   ${DELAY}
    screen should contain   48
  #  ${v} =   Selenium2Library.get text    css=div.esri-view-surface.esri-view-surface--inset-outline > div:nth-child(7)
  #  should be equal  ${v}     48.86 km
    click element        css=[id='remove-measurement']
    click element        css=[id='toggle-draw-tools']

Piirra alue kartalle
    [Tags]            smoke
    [Documentation]   Piirrä alue ja tarkistaa onko ala oikein
    click element        css=[id='toggle-draw-tools']
    click element        css=[id='draw-polygon']
    click element at coordinates    css=[class~='esri-ui']     0      0
    click element at coordinates    css=[class~='esri-ui']    100    100
    click element at coordinates    css=[class~='esri-ui']     50    -50
    set selenium speed   0
    click element at coordinates    css=[class~='esri-ui']    -50    -50
    click element at coordinates    css=[class~='esri-ui']    -50    -50
    Set Selenium Speed   ${DELAY}
    screen should contain   11
    click element        css=[id='remove-measurement']
    click element        css=[id='toggle-draw-tools']

Aluevalinta kartalta suorakulmion avulla
    [Tags]            smoke
    [Documentation]   Valitse alue suorakulmio, lisää siihen puskurialue ja vertaa valittuja alueita
    click element        css=[id='toggle-select-tools']
    click element        css=[id='draw-rectangle']
    SikuliLibrary.drag and drop by offset    vuo    100    150
    Wait Until Screen Contain    suorak      5
    click element        css=[class~='fa-angle-up']
    click element        css=[class~='fa-dot-circle']
    Selenium2Library.input text    css=label [type='number']   1204
    click element        xpath=.//div[button='Laske']/button[1]
    click element        css=[class~='fa-angle-down']
    Wait Until Screen Contain    pusk      5
    click element        css=[id='remove-selection']
    click element        css=[id='toggle-select-tools']

Aluevalinta ympyra kanssa
    [Tags]            smoke
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
    [Tags]            smoke
    [Documentation]   Valitse alue lasso ja vertaa valittuja alueita
    click element        css=[id='toggle-select-tools']
    click element        css=[id='draw-polygon-select']
    click element at coordinates    css=[class~='esri-ui']         0      0
    click element at coordinates    css=[class~='esri-ui']         100    100
    click element at coordinates    css=[class~='esri-ui']         50    -50
    set selenium speed   0
    click element at coordinates    css=[class~='esri-ui']         -50    -50
    click element at coordinates    css=[class~='esri-ui']         -50    -50
    Set Selenium Speed   ${DELAY}
    Wait Until Screen Contain    lass   5
    click element        css=[id='remove-selection']
    click element        css=[id='toggle-select-tools']

Haku ikkunan kaytto
    [Tags]            smoke
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
    [Tags]            smoke
    [Documentation]   Valitsee tason ja muokkaa sitä, piirtää alueen ja tallentaa, sitten poistaa kohteen
    click Element        css=[class~='fa-map']
  #  click element        css=div:nth-child(1) >div:nth-child(2) [class~='fa-toggle-off']
    Click Element        css=div.layer-view-scroll-wrapper > div:nth-child(1) > div > div:nth-child(2) [class~='fa-edit']
    click Element        css=[class~='fa-map']
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
    click Element        css=[class~='fa-map']
    Click Element        css=div.layer-view-scroll-wrapper > div:nth-child(1) > div > div:nth-child(2) [class~='fa-edit']
    click Element        css=[class~='fa-map']

Yllapito kentan muokkaus taulukosta
    [Tags]            smoke
    [Documentation]   Valitsee tason ja sieltä kohteen, muokkaa kenttää ja tallentaa
    click Element        css=[class~='fa-map']
 #   click element        css=div:nth-child(1) >div:nth-child(2) [class~='fa-toggle-off']
    Click Element        css=div.layer-view-scroll-wrapper > div:nth-child(1) > div > div:nth-child(2) [class~='fa-edit']
    click Element        css=[class~='fa-map']
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
    click Element        css=[class~='fa-map']
    Click Element        css=div.layer-view-scroll-wrapper > div:nth-child(1) > div > div:nth-child(2) [class~='fa-edit']
    click Element        css=[class~='fa-map']

    click element             css=[class~='fa-angle-down']
 #   click element             css=[title="Sulje"]

Yllapito poista valittu kohde
    [Tags]            smoke
    [Documentation]   Valitsee jonkin kohteen ja poistaa sen
    click Element        css=[class~='fa-map']
 #   click element        css=div:nth-child(1) >div:nth-child(2) [class~='fa-toggle-off']
    Click Element        css=div.layer-view-scroll-wrapper > div:nth-child(1) > div > div:nth-child(2) [class~='fa-edit']
    click Element        css=[class~='fa-map']
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

Tulosta alue
    [Tags]            smoke
    [Documentation]   Vie näkyvän alueen halutulla formaatilla tiedostoon, mikä on tulostettavissa
    Selenium2Library.Click Element    css=[class~='fa-map']
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
   # Selenium2Library.Click Element        css=[class~='esri-print__exported-file-link-title']
    Wait Until Element Is Enabled     css=[class~='esri-print__exported-file-link-title']      timeout=30
    Wait Until Keyword Succeeds   10x  6  Selenium2Library.Click Element   css=[class~='esri-print__exported-file-link-title']

    run keyword and ignore error      screen Should not Contain     xwin
    screen Should Contain             test
    SikuliLibrary.Click               ksr
    Selenium2Library.Click Element    css=[class~='fa-print']

   #  pause execution
    #kirjaudu ulos

