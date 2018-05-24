package fi.sitowise.ksr;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class KsrApplication {

	private static Logger logger = LogManager.getLogger(KsrApplication.class);

	public static void main(String[] args) {
		
		SpringApplication.run(KsrApplication.class, args);
		logger.info("Entered application...");

	}
}
