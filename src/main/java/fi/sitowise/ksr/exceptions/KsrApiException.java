package fi.sitowise.ksr.exceptions;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * A Utility class to throw and log HTTP-errors.
 */
public abstract class KsrApiException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    private static final Logger log = LogManager.getLogger(KsrApiException.class);

    /**
     * Instantiates a new Ksr api exception.
     *
     * @param message Error message
     */
    public KsrApiException(String message) {
        super(message);
        log.error(message);
    }

    /**
     * Instantiates a new Ksr api exception.
     *
     * @param message Error message
     * @param e       Exception stacktrace
     */
    public KsrApiException(String message, Exception e) {
        super(message);
        log.error(message, e);
    }

    /**
     * Raise a HTTP 400 - Bad Request Error
     */
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    public static class BadRequestException extends KsrApiException {
        private static final long serialVersionUID = 1L;

        /**
         * Raises a HTTP 400 - Bad Request Error
         *
         * @param message Error message
         */
        public BadRequestException(String message) {
            super(message);
        }

        /**
         * Raises a HTTP 400 - Bad Request Error
         *
         * @param message Error message
         * @param e       Exception stacktrace
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
         *
         * @param message Error message
         */
        public InternalServerErrorException(String message) {
            super(message);
        }

        /**
         * Raises a HTTP 500 - Internal Server Error
         *
         * @param message Error message
         * @param e       Exception stacktrace
         */
        public InternalServerErrorException(String message, Exception e) {
            super(message, e);
        }
    }

    /**
     * Raises a HTTP 404 - Not Found Error
     */
    @ResponseStatus(code = HttpStatus.NOT_FOUND)
    public static class NotFoundErrorException extends KsrApiException {
        private static final long serialVersionUID = 1L;

        /**
         * Raises a HTTP 404 - Not Found Error
         *
         * @param message Error message
         */
        public NotFoundErrorException(String message) {
            super(message);
        }
    }

    /**
     * Raises a HTTP 403 - Forbidden Error
     */
    @ResponseStatus(code = HttpStatus.FORBIDDEN)
    public static class ForbiddenException extends KsrApiException {
        private static final long serialVersionUID = 1L;

        /**
         * Raises a HTTP 403 - Forbidden Error
         *
         * @param message Error message
         */
        public ForbiddenException(String message) { super(message); }
    }
}
