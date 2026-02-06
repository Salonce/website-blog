package salonce.dev.todolist.account.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import salonce.dev.todolist.account.application.AccountService;
import salonce.dev.todolist.account.infrastructure.security.AccountPrincipal;
import salonce.dev.todolist.account.presentation.dtos.AccountResponse;
import salonce.dev.todolist.account.presentation.dtos.PatchProfileRequest;
import salonce.dev.todolist.account.presentation.dtos.UserResponse;

@RequiredArgsConstructor
@RestController
public class AccountController {

    private final AccountService accountService;

    @GetMapping("/api/auth")
    public ResponseEntity<AccountPrincipal> getAuth(@AuthenticationPrincipal AccountPrincipal principal){
        return ResponseEntity.ok(principal);
    }

    @GetMapping("/api/account")
    public ResponseEntity<AccountResponse> getAccount(@AuthenticationPrincipal AccountPrincipal principal){
        return ResponseEntity.ok(AccountMapper.toAccountResponse(accountService.findAccount(principal.id())));
    }

    @PatchMapping("/api/profile")
    public ResponseEntity<AccountResponse> patchProfile(@AuthenticationPrincipal AccountPrincipal principal, @RequestBody PatchProfileRequest patchProfileRequest){
        return ResponseEntity.ok(accountService.updateProfile(principal.id(), patchProfileRequest));
    }
}
