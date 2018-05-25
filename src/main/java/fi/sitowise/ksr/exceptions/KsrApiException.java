package fi.sitowise.ksr.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public abstract class KsrApiException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public KsrApiException(String message) {
        super(message);
    }

    public KsrApiException(String message, Exception e) {
        super(message);
    }

    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    public static class BadRequestException extends KsrApiException {
        private static final long serialVersionUID = 1L;

        public BadRequestException(String message) {
            super(message);
        }

        public BadRequestException(String message, Exception e) {
            super(message, e);
        }
    }

    @ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
    public static class InternalServerErrorException extends KsrApiException {
        private static final long serialVersionUID = 1L;

        public InternalServerErrorException(String message) {
            super(message);
        }

        public InternalServerErrorException(String message, Exception e) {
            super(message, e);
        }
    }
}
