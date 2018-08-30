# Matti Telenius       Dimenteq Oy     2018
# testit ajetaan scr hakemistossa vaikka komennolla:
# pybot -L TRACE  -d output -i smoke test

*** Settings ***
Library                     Selenium2Library    implicit_wait=1   timeout=40.0
Library                     selenium_extensions.py

#Resource                    c:\\tools\\oma\\ksr.robot

*** Variables ***
${BROWSER}             Chrome
#${BROWSER}              Firefox
${DELAY}               0.5
${LOGIN URL}           http://localhost:3000/
${username_input}      id=userNameInput
${pwd_input}           id=passwordInput
${kirjaudu_btn}        id=submitButton

*** Keywords ***
Open MainPage
    Log                             ${BROWSER}
    Log                             ${LOGIN URL}
    Open Browser      ${LOGIN URL}    ${BROWSER}
    Selenium2Library.go to                           ${LOGIN URL}
    Set Selenium Speed  ${DELAY}
    Maximize Browser Window
#    ${temp}=                        set variable        ${LOG LEVEL}
#    set log level                   NONE
#    ${t} =    page should contain      Sign in
#    log   ${t}
#    click element     css=div.idp:nth-child(4)
  #  run keyword if   "${LOGIN URL}" in "https://dimenteq.ad"    Kirjaudu sisään  ${USER}  ${PWD}
   # ...  ELSE   Kirjaudu sisan     ${USER}  ${PWD}
#    Kirjaudu sisaan     ${USER}  ${PWD}
#    Set Log Level                   ${temp}

Kirjaudu sisaan  [Arguments]  ${Username}  ${Password}
    wait until element is visible   ${username_input}
    input text                      ${username_input}  ${Username}
    input text                      ${pwd_input}       ${Password}
    click element                   ${kirjaudu_btn}
    Wait Until Element Is Visible   ${header_name_elem}

Kirjaudu ulos
    wait until element is visible   ${header_kirjaudu_ulos}
    click element                   ${header_kirjaudu_ulos}
