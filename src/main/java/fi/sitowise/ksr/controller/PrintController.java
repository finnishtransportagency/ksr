package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.service.PrintService;
import fi.sitowise.ksr.utils.KsrRequestUtils;
import fi.sitowise.ksr.utils.KsrStringUtils;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.regex.Pattern;

/**
 * Controller to proxy print-requests
 */
@RestController
@RequestMapping(PrintController.PRINT_URL)
public class PrintController {

    private Pattern printProxyUrlPattern;
    private final PrintService printService;
    static final String PRINT_CONTROLLER_URL = "/api/GPServer/Export Web Map Task";
    static final String PRINT_URL = "/api/GPServer";

    @Value("${server.servlet.context-path}")
    private String contextPath;

    @Autowired
    public PrintController(PrintService printService) {
        this.printService = printService;
    }

    @PostConstruct
    public void setUpPrintProxyUrlMatcher() {
        String patternToMatch = "/api/GPServer/Export%20Web%20Map%20Task/(.*?)$";
        printProxyUrlPattern = Pattern.compile(KsrStringUtils.replaceMultipleSlashes(patternToMatch));
    }

    @RequestMapping(value = "/**", method = { RequestMethod.GET, RequestMethod.POST })
    public void printProxy(HttpServletRequest request, HttpServletResponse response) {
        String serviceEndpoint = KsrRequestUtils.getServiceEndpoint(printProxyUrlPattern, request.getRequestURI());
        try {
            printService.getPrintRequest(serviceEndpoint, request, response);
        } catch (ParseException | IOException e) {
            String msg = "Error handling print request";
            throw new KsrApiException.InternalServerErrorException(msg, e);
        }
    }
}
