package fi.sitowise.ksr;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication(scanBasePackages = { "fi.sitowise.ksr" })
@EnableCaching
public class KsrApplication extends SpringBootServletInitializer {
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(KsrApplication.class);
	}

	private static Logger log = LogManager.getLogger(KsrApplication.class);

	public static void main(String[] args) {

		SpringApplication.run(KsrApplication.class, args);
        log.info("Entered application...");

	}
}
