package salonce.dev.todolist.account.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import salonce.dev.todolist.account.application.AccountService;
import salonce.dev.todolist.account.application.UserService;
import salonce.dev.todolist.account.domain.Account;
import salonce.dev.todolist.account.domain.Role;
import salonce.dev.todolist.account.infrastructure.security.AccountPrincipal;
import salonce.dev.todolist.account.presentation.dtos.AccountResponse;
import salonce.dev.todolist.account.presentation.dtos.UserResponse;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class UserController {

    private final UserService userService;
    private final AccountService accountService;

    @GetMapping("/api/users")
    public ResponseEntity<List<UserResponse>> getUsers(@AuthenticationPrincipal AccountPrincipal principal){
        return ResponseEntity.ok(userService.getAllUsers(principal));
    }

    @GetMapping("/api/user/{id}")
    public ResponseEntity<UserResponse> getUser(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long id){
        return ResponseEntity.ok(userService.getUser(principal, id));
    }

    @PostMapping("/{id}/roles/{role}")
    public ResponseEntity<UserResponse> addRole(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long id,@PathVariable Role role) {
        return ResponseEntity.ok(accountService.addRole(principal, id, role));
    }

    // Remove a single role
    @DeleteMapping("/{id}/roles/{role}")
    public ResponseEntity<UserResponse> removeRole(
            @AuthenticationPrincipal AccountPrincipal principal,
            @PathVariable Long id,
            @PathVariable Role role) {

        return ResponseEntity.ok(accountService.removeRole(principal, id, role));
    }
}
