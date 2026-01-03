package salonce.dev.todolist.account.application;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import salonce.dev.todolist.account.domain.Account;
import salonce.dev.todolist.account.infrastructure.AccountRepository;
import salonce.dev.todolist.account.presentation.dtos.PatchProfileRequest;
import salonce.dev.todolist.task.application.exceptions.AccountNotFound;

@RequiredArgsConstructor
@Service
public class AccountService {

    private final AccountRepository accountRepository;

    public Account saveAccount(AccountDto accountDto){
        Account account = new Account(accountDto.email(), accountDto.name(), accountDto.subject(), accountDto.provider());
        return accountRepository.save(account);
    }

    public Account loadOrCreateAccount(AccountDto accountDto){
        return accountRepository.findByIdentity(accountDto.subject(), accountDto.provider())
                .orElseGet(() ->
                {
                    Account newAccount = new Account(accountDto.email(), accountDto.name(), accountDto.subject(), accountDto.provider());
                    if (accountRepository.count() == 0) newAccount.addAdminRole();
                    return accountRepository.save(newAccount);
                });
    }

    public Account findAccount(Long id){
        return accountRepository.findById(id).orElseThrow(AccountNotFound::new);
    }

    @Transactional
    public Account updateProfile(Long id, PatchProfileRequest request){
        Account account = accountRepository.findById(id).orElseThrow(AccountNotFound::new);
        account.setName(request.name());
        return accountRepository.save(account);
    }
}
