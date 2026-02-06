package salonce.dev.todolist.account.infrastructure.security;

import salonce.dev.todolist.account.domain.Role;

import java.util.Set;

public record AccountPrincipal(
        Long id,
        String email,
        Set<Role> roles
){}