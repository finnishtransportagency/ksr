package fi.sitowise.ksr.proxy;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.client.CloseableHttpClient;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class HttpRequestThread implements Runnable {

    private CloseableHttpClient closeableHttpClient;
    private String method;
    private String endPointUrl;
    private RequestConfig requestConfig;
    private HttpServletResponse response;


    public HttpRequestThread(final CloseableHttpClient closeableHttpClient, final String method,
                             final String endPointUrl, final HttpServletResponse response,
                             final RequestConfig requestConfig) {
        this.closeableHttpClient = closeableHttpClient;
        this.method = method;
        this.endPointUrl = endPointUrl;
        this.response = response;
        this.requestConfig = requestConfig;
    }

    public final void run() {
        HttpRequestBase base = getRequestBase(method, endPointUrl, requestConfig);

        try {
            CloseableHttpResponse cRes = closeableHttpClient.execute(base);

            response.setStatus(cRes.getStatusLine().getStatusCode());
            setResponseHeaders(response, cRes);
            setResponseContent(response, cRes);
            cRes.close();
        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }

    public HttpRequestBase getRequestBase(String method, String endPointUrl, RequestConfig requestConfig) {
        HttpRequestBase base;
        switch (method) {
            case "GET":
                base = new HttpGet(endPointUrl);
                break;
            default:
                base = new HttpGet(endPointUrl);
        }
        base.setConfig(requestConfig);
        return base;
    }

    public void setResponseHeaders(HttpServletResponse response, CloseableHttpResponse cRes) {
        String[] headerNames = { "Content-Type", "Content-Length", "Cache-control", "Expires", "Last-Modified" };
        for (String headerName : headerNames) {
            Header header = cRes.getFirstHeader(headerName);
            if (header != null) {
                response.setHeader(header.getName(), header.getValue());
            }
        }
    }

    public void setResponseContent(HttpServletResponse response, CloseableHttpResponse cRes) throws IOException{
        HttpEntity entity = cRes.getEntity();
        ServletOutputStream out = response.getOutputStream();
        if (out != null && entity != null) {
            entity.writeTo(out);
        }
    }
}
