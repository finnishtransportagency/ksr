package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.MapLayer;

import fi.sitowise.ksr.proxy.HttpRequestThread;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;

@Service
public class ProxyService {

    private CloseableHttpClient closeableHttpClient;
    private RequestConfig requestConfig;

    @Value("${proxy.maxDefaultPerRoute}")
    private Integer maxDefaultPerRoute;

    @Value("${proxy.maxTotal}")
    private Integer maxTotal;

    @Value("${proxy.socketTimeout}")
    private Integer socketTimeout;

    @Autowired
    public void setClient() {
        PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager();
        cm.setDefaultMaxPerRoute(maxDefaultPerRoute);
        cm.setMaxTotal(maxTotal);
        this.closeableHttpClient = HttpClients.custom().setConnectionManager(cm).build();
    }

    @Autowired
    public void setRequestConfig() {
        RequestConfig.Builder requestConfigBuilder = RequestConfig.custom();
        requestConfigBuilder.setSocketTimeout(socketTimeout);
        this.requestConfig = requestConfigBuilder.build();
    }

    public String getEndpointUrl(MapLayer mapLayer, String serviceEndpoint, String queryString) {
        String mlUrl = mapLayer.getUrl();

        StringBuilder urlBuilder = new StringBuilder(mlUrl);
        // Also ensure that there is a slash between those two url base parts.
        urlBuilder.append(mlUrl.substring(mlUrl.length() - 1).equals("/") ? "" : "/");
        urlBuilder.append(serviceEndpoint);
        if (queryString.length() > 0) {
            urlBuilder.append("?");
            urlBuilder.append(queryString);
        }

        return urlBuilder.toString();
    }

    public void get(MapLayer mapLayer, String queryString, String method, String serviceEndpoint, HttpServletResponse response) {
        String endPointUrl = getEndpointUrl(mapLayer, serviceEndpoint, queryString);
        HttpRequestThread thread = new HttpRequestThread(closeableHttpClient, method, endPointUrl, response, requestConfig);
        thread.run();
    }
}
