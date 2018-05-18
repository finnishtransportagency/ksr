package fi.sitowise.ksr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication(scanBasePackages = { "fi.sitowise.ksr" })
public class KsrApplication extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(KsrApplication.class);
	}
	
	public static void main(String[] args) {
		SpringApplication.run(KsrApplication.class, args);
	}
}
