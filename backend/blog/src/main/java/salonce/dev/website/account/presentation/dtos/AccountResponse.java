package salonce.dev.website.account.presentation.dtos;

import salonce.dev.website.account.domain.Role;

import java.util.Set;

public record AccountResponse(Long id, String email, String name, Set<Role> roles) {}
