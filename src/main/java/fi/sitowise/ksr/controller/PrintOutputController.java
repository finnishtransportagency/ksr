package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.service.PrintService;
import fi.sitowise.ksr.utils.KsrRequestUtils;
import fi.sitowise.ksr.utils.KsrStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.regex.Pattern;

@RestController
@RequestMapping(PrintOutputController.PRINT_OUTPUT_URL)
public class PrintOutputController {

    private final PrintService printService;
    public static final String PRINT_OUTPUT_URL = "/api/print/output";
    private Pattern printOutputProxyUrlPattern;

    @Value("${server.servlet.context-path}")
    private String contextPath;

    @Autowired
    public PrintOutputController(PrintService printService) {
        this.printService = printService;
    }

    @PostConstruct
    public void setUpPrintProxyUrlMatcher() {
        String patternToMatch = "/api/print/output/(.*?)$";
        printOutputProxyUrlPattern = Pattern.compile(KsrStringUtils.replaceMultipleSlashes(patternToMatch));
    }

    @RequestMapping(value = "/**", method = { RequestMethod.GET })
    public void printOutputProxy(HttpServletRequest request, HttpServletResponse response) {
        String serviceEndpoint = KsrRequestUtils.getServiceEndpoint(printOutputProxyUrlPattern, request.getRequestURI());
        printService.getPrintOutput(serviceEndpoint, request, response);
    }
}
