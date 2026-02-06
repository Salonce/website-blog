package salonce.dev.todolist.account.presentation.dtos;

import salonce.dev.todolist.account.domain.Role;

import java.util.Set;

public record UserResponse(Long id, String email, String name, Set<Role> roles) {}
