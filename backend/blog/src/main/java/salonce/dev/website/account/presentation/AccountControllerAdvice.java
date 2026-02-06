package salonce.dev.website.account.presentation;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import salonce.dev.website.shared.ApiError;

@RestControllerAdvice
public class AccountControllerAdvice {
    @ExceptionHandler(AccountNotFound.class)
    public ResponseEntity<ApiError> accountNotFound(){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError("Account not found"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> accessDenied(){
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiError("Access forbidden"));
    }
}
