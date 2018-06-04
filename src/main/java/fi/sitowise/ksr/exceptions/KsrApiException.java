package fi.sitowise.ksr.exceptions;

import fi.sitowise.ksr.utils.KsrStringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * A Utility class to throw and log HTTP-errors.
 */
public abstract class KsrApiException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    private static Logger log = LogManager.getLogger(KsrApiException.class);

    public KsrApiException(String message) {
        super(message);
    }

    public KsrApiException(String message, Exception e) {
        super(message);
        log.error(message, e.getStackTrace());
    }

    /**
     * Raise a HTTP 400 - Bad Request Error
     */
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    public static class BadRequestException extends KsrApiException {
        private static final long serialVersionUID = 1L;

        /**
         * Raises a HTTP 400 - Bad Request Error
         * @param message Error message
         *
         */
        public BadRequestException(String message) {
            super(message);
        }

        /**
         * Raises a HTTP 400 - Bad Request Error
         * @param message Error message
         * @param e Exception stacktrace.
         */
        public BadRequestException(String message, Exception e) {
            super(message, e);
        }
    }

    /**
     * Raise a HTTP 500 - Internal Server Error
     */
    @ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
    public static class InternalServerErrorException extends KsrApiException {
        private static final long serialVersionUID = 1L;

        /**
         * Raises a HTTP 500 - Internal Server Error
         * @param message Error message
         */
        public InternalServerErrorException(String message) {
            super(message);
        }

        /**
         * Raises a HTTP 500 - Internal Server Error
         * @param message Error message
         * @param e Exception stacktrace.
         */
        public InternalServerErrorException(String message, Exception e) {
            super(message, e);
        }
    }
}
