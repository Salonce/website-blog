package salonce.dev.todolist.account.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RestController;
import salonce.dev.todolist.account.infrastructure.security.AccountPrincipal;
import salonce.dev.todolist.account.presentation.dtos.UserResponse;

@RequiredArgsConstructor
@RestController
public class UserController {
//    @GetMapping("/api/users")
//    public ResponseEntity<UserResponse> getUsers(@AuthenticationPrincipal AccountPrincipal principal){
//        return ResponseEntity.ok(principal);
//    }
//
//    @PatchMapping("/api/user")
//    public ResponseEntity<UserResponse> getUsers(@AuthenticationPrincipal AccountPrincipal principal){
//        return ResponseEntity.ok(principal);
//    }
}
