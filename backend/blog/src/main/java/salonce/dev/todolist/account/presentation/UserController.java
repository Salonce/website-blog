package salonce.dev.todolist.account.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import salonce.dev.todolist.account.application.UserService;
import salonce.dev.todolist.account.infrastructure.security.AccountPrincipal;
import salonce.dev.todolist.account.presentation.dtos.UserResponse;
import salonce.dev.todolist.account.presentation.dtos.UserUpdateRequest;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class UserController {

    private final UserService userService;

    @GetMapping("/api/users")
    public ResponseEntity<List<UserResponse>> getUsers(@AuthenticationPrincipal AccountPrincipal principal){
        return ResponseEntity.ok(userService.getAllUsers(principal));
    }

    @GetMapping("/api/user/{id}")
    public ResponseEntity<UserResponse> getUsers(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long id){
        return ResponseEntity.ok(userService.getUser(principal, id));
    }

    @PatchMapping("/api/user/{id}")
    public ResponseEntity<UserResponse> updateUser(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long id, @RequestBody UserUpdateRequest userUpdateRequest){
        return ResponseEntity.ok(userService.getUser(principal, id));
    }
}
