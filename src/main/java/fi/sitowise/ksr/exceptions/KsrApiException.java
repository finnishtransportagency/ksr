package fi.sitowise.ksr.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public abstract class KsrApiException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public KsrApiException(String message) {
        super(message);
    }

    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    public static class BadRequestException extends KsrApiException {
        private static final long serialVersionUID = 1L;

        public BadRequestException(String message) {
            super(message);
        }
    }
}
