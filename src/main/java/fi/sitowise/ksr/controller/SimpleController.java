package fi.sitowise.ksr.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import fi.sitowise.ksr.authentication.OAMAuthenticationToken;
import fi.sitowise.ksr.authentication.User;

@RestController
public class SimpleController {
	
	
	/**
	 * Simple example to test/showcase authentication.
	 *
	 * @param request the request
	 * @return the string
	 */
	@RequestMapping(value="/simple", method=RequestMethod.GET)
	public @ResponseBody String simple(HttpServletRequest request) {
		OAMAuthenticationToken authToken = (OAMAuthenticationToken) request.getUserPrincipal();
		User user = authToken.getUser();
		return user.getFirstName();
	}
}
