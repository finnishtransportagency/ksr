# Matti Telenius       Dimenteq Oy     2018

import pyautogui as ag

from selenium.webdriver.common.action_chains import ActionChains
from robot.libraries.BuiltIn import BuiltIn
from selenium.webdriver.common.keys import Keys

#from selenium.webdriver.common.utils import keys_to_typing

def doubleclick_element_at_coordinates(locator, xoffset, yoffset):
    if not locator:
        raise ValueError()
    s2l = BuiltIn().get_library_instance('Selenium2Library')
    driver = s2l._current_browser()
#    elem = driver.find_element_by_id(locator)
#    elem = driver.find_element_by_css_selector(locator)
#    elem = s2l._element_find(locator, True, True)
    elem = s2l.find_element(locator)
    ActionChains(driver).move_to_element(elem).move_by_offset(xoffset, yoffset).double_click().perform()

def  click_css(elem):
    s2l = BuiltIn().get_library_instance('Selenium2Library')
    driver = s2l._current_browser()
    driver.find_element_by_css_selector(elem).click()

def  click_text(txt):
    s2l = BuiltIn().get_library_instance('Selenium2Library')
    driver = s2l._current_browser()
    driver.find_element_by_link_text(txt).click()

def  click_class(cla):
    s2l = BuiltIn().get_library_instance('Selenium2Library')
    driver = s2l._current_browser()
    driver.find_element_by_class_name(cla).click()

def  click_id(id):
    s2l = BuiltIn().get_library_instance('Selenium2Library')
    driver = s2l._current_browser()
    driver.find_element_by_id(id).click()

def send_left_key():
    s2l = BuiltIn().get_library_instance('Selenium2Library')
    driver = s2l._current_browser()
    ActionChains(driver).send_keys(Keys.LEFT).perform()

def send_down_key():
    s2l = BuiltIn().get_library_instance('Selenium2Library')
    driver = s2l._current_browser()
    ActionChains(driver).send_keys(Keys.DOWN).perform()

def send_enter_key():
    s2l = BuiltIn().get_library_instance('Selenium2Library')
    driver = s2l._current_browser()
    ActionChains(driver).send_keys(Keys.ENTER).perform()

def drag_to(button, *coordinates):
    coordinates = [int(coord) for coord in coordinates]
    ag.dragTo(*coordinates, duration=1, button=button)
