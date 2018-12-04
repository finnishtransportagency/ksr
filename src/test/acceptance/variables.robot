# Matti Telenius       Dimenteq Oy     2018
# testit ajetaan scr hakemistossa vaikka komennolla:
# pybot -L TRACE  -d output -i smoke test
*** Settings ***
Library                     Selenium2Library    implicit_wait=1   timeout=40.0
#Library                     selenium_extensions.py

#Resource                    c:\\tools\\oma\\ksr.robot

*** Variables ***
#${BROWSER}             Chrome
#${BROWSER}             Firefox
${BROWSER}             headlesschrome
${DELAY}               0.5
#${LOGIN URL}           http://localhost:3000/
${LOGIN URL}           https://devtest.liikennevirasto.fi/ksr/
${username_input}      id=userNameInput
${pwd_input}           id=passwordInput
${LiviUserNameField}   id=username
${LiviPasswordField}   id=password
${kirjaudu_btn}        id=submitButton
${LiviLoginButton}     css=.submit
${LiviUSER}
${LiviPWD}
${header_name_elem}    class=esri-view-root


*** Keywords ***
Open MainPage
    Log                             ${BROWSER}
    Log                             ${LOGIN URL}
    Open Browser      ${LOGIN URL}    ${BROWSER}
    Selenium2Library.go to                           ${LOGIN URL}
    Set Selenium Speed  ${DELAY}
    Maximize Browser Window
    ${temp}=                        set variable        ${LOG LEVEL}
    set log level                   NONE
    run keyword if   "${LOGIN URL}" in "https://devtest.liikennevirasto.fi/ksr/"    Kirjaudu sisaan  ${USER}  ${PWD}
    Set Log Level                   ${temp}

Open MainPage Headless
    #Open Headless Chrome
    ${options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    Call Method    ${options}    add_argument    --disable-gpu
    Call Method    ${options}    add_argument    --headless
    Call Method    ${options}    add_argument    --no-sandbox
    Create Webdriver    Chrome    options=${options}
    set window size    1920   1200
    Selenium2Library.go to        ${LOGIN URL}
    Set Selenium Speed  ${DELAY}
    Maximize Browser Window
    ${temp}=                        set variable        ${LOG LEVEL}
    set log level                   NONE
    run keyword if   "${LOGIN URL}" in "https://devtest.liikennevirasto.fi/ksr/"    Kirjaudu sisaan  ${LiviUSER}  ${LiviPWD}
    Set Log Level                   ${temp}

Kirjaudu sisaan  [Arguments]  ${Username}  ${Password}
    wait until element is visible   ${LiviUserNameField}
    Selenium2Library.input text     ${LiviUserNameField}   ${Username}
    Selenium2Library.input text     ${LiviPasswordField}   ${Password}
    click element                   ${LiviLoginButton}
    run keyword and ignore error    Wait Until Element Is Visible    css=[class='loading-icon']     timeout=5
    run keyword and ignore error    Wait Until Element Is Not Visible   css=[class='loading-icon']   timeout=30

Kirjaudu ulos
    wait until element is visible   ${header_kirjaudu_ulos}
    click element                   ${header_kirjaudu_ulos}
