package salonce.dev.todolist.account.presentation;

import salonce.dev.todolist.account.domain.Account;
import salonce.dev.todolist.account.domain.Role;
import salonce.dev.todolist.account.presentation.dtos.AccountResponse;
import salonce.dev.todolist.account.presentation.dtos.UserResponse;

import java.util.Set;
import java.util.stream.Collectors;

public class AccountMapper {
    public static AccountResponse toAccountResponse(Account account){
        return new AccountResponse(account.getId(), account.getEmail(), account.getName(), account.getRoles());
    }

    public static UserResponse toUserResponse(Account account){
        return new UserResponse(account.getId(), account.getEmail(), account.getName(), account.getRoles());
    }

    private static Set<String> mapRolesToStrings(Set<Role> roles) {
        return roles.stream()
                .map(Role::name)
                .collect(Collectors.toSet());
    }
}
