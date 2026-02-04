package salonce.dev.todolist.account.presentation;

import salonce.dev.todolist.account.domain.Account;
import salonce.dev.todolist.account.presentation.dtos.AccountResponse;
import salonce.dev.todolist.account.presentation.dtos.UserResponse;

public class AccountMapper {
    public static AccountResponse toAccountResponse(Account account){
        return new AccountResponse(account.getId(), account.getEmail(), account.getName(), account.getRoles());
    }

    public static UserResponse toUserResponse(Account account){
        return new UserResponse(account.getId(), account.getEmail(), account.getName(), account.getRoles());
    }
}
