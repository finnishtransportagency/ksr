# Matti Telenius       Sitowise Oy     2019

import pyautogui as ag

from selenium.webdriver.common.action_chains import ActionChains
from robot.libraries.BuiltIn import BuiltIn
from selenium.webdriver.common.keys import Keys
#from pyproj import Proj, transform

#from selenium.webdriver.common.utils import keys_to_typing

def doubleclick_element_at_coordinates(locator, xoffset, yoffset):
    if not locator:
        raise ValueError()
    s2l = BuiltIn().get_library_instance('SeleniumLibrary')
    driver = s2l.driver
    #driver 
#    elem = driver.find_element_by_id(locator)
#    elem = driver.find_element_by_css_selector(locator)
#    elem = s2l._element_find(locator, True, True)
    elem = s2l.find_element(locator)
    ActionChains(driver).move_to_element(elem).move_by_offset(xoffset, yoffset).double_click().perform()

#def file():
#    s2l = BuiltIn().get_library_instance('SeleniumLibrary')
#    driver = s2l.driver
#    driver.find_element_by_css_selector('[class~='fa-download']').click()
#    ActionChains(driver).sendkeys(elem, 'C:\\temp\\x.txt')

def  click_css(elem):
    s2l = BuiltIn().get_library_instance('SeleniumLibrary')
    driver = s2l.driver
    driver.find_element_by_css_selector(elem).click()

def  click_text(txt):
    s2l = BuiltIn().get_library_instance('SeleniumLibrary')
    driver = s2l.driver
    driver.find_element_by_link_text(txt).click()

def send_up_key():
    s2l = BuiltIn().get_library_instance('SeleniumLibrary')
    driver = s2l.driver
    ActionChains(driver).send_keys(Keys.UP).perform()

def send_down_key():
    s2l = BuiltIn().get_library_instance('SeleniumLibrary')
    driver = s2l.driver
    ActionChains(driver).send_keys(Keys.DOWN).perform()

def send_enter_key():
    s2l = BuiltIn().get_library_instance('SeleniumLibrary')
    driver = s2l.driver
    ActionChains(driver).send_keys(Keys.ENTER).perform()

def drag_to(button, *coordinates):
    coordinates = [int(coord) for coord in coordinates]
    ag.dragTo(*coordinates, duration=1, button=button)

#def convert_to_EPSG3067(x,y):
#    OutProj = Proj(init='epsg:3067')
#    InProj = Proj(init='epsg:4326')
#    x2,y2 = transform(InProj,OutProj,x,y)
#    return     x2,y2

#def convert_to_WGS84(x,y):
#    InProj = Proj(init='epsg:3067')
#    OutProj = Proj(init='epsg:4326')
#    x2,y2 = transform(InProj,OutProj,x,y)
#    return     x2,y2

def drag_and_drop_by_offset(locator, xoffset, yoffset):
    if not locator:
        raise ValueError()
    s2l = BuiltIn().get_library_instance('SeleniumLibrary')
    driver = s2l.driver
    element = s2l.find_element(locator)
    ActionChains(driver).drag_and_drop_by_offset(element,int(xoffset), int(yoffset)).perform()

def press_shift_and_drag_and_drop_by_offset(locator, xoffset, yoffset):
    if not locator:
        raise ValueError()
    s2l = BuiltIn().get_library_instance('SeleniumLibrary')
    driver = s2l.driver
    element = s2l.find_element(locator)
    ActionChains(driver).key_down(Keys.SHIFT).drag_and_drop_by_offset(element,int(xoffset), int(yoffset)).key_up(Keys.SHIFT).perform()

def press_control_and_drag_and_drop_by_offset(locator, xoffset, yoffset):
    if not locator:
        raise ValueError()
    s2l = BuiltIn().get_library_instance('SeleniumLibrary')
    driver = s2l.driver
    element = s2l.find_element(locator)
    ActionChains(driver).key_down(Keys.CONTROL).drag_and_drop_by_offset(element,int(xoffset), int(yoffset)).key_up(Keys.CONTROL).perform()

def click_element_and_press_control_at_coordinates(locator, xoffset, yoffset):
    if not locator:
        raise ValueError()
    s2l = BuiltIn().get_library_instance('SeleniumLibrary')
    driver = s2l.driver
    elem = s2l.find_element(locator)
    ActionChains(driver).key_down(Keys.CONTROL).move_to_element(elem).move_by_offset(xoffset, yoffset).click().key_up(Keys.CONTROL).perform()
