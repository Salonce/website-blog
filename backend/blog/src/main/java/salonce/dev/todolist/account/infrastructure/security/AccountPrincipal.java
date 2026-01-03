package salonce.dev.todolist.account.infrastructure.security;

import java.util.Set;

public record AccountPrincipal(
        Long id,
        String email,
        Set<String> roles
){}