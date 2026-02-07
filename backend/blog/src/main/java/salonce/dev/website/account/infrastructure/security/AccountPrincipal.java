package salonce.dev.website.account.infrastructure.security;

import salonce.dev.website.account.domain.Role;

import java.util.Set;

public record AccountPrincipal(
        Long id,
        String email,
        Set<Role> roles
){}