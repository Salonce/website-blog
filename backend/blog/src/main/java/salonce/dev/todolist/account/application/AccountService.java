package salonce.dev.todolist.account.application;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import salonce.dev.todolist.account.domain.Account;
import salonce.dev.todolist.account.domain.Role;
import salonce.dev.todolist.account.infrastructure.AccountRepository;
import salonce.dev.todolist.account.infrastructure.security.AccountPrincipal;
import salonce.dev.todolist.account.presentation.AccountMapper;
import salonce.dev.todolist.account.presentation.dtos.AccountResponse;
import salonce.dev.todolist.account.presentation.dtos.PatchProfileRequest;
import salonce.dev.todolist.account.presentation.AccountNotFound;
import salonce.dev.todolist.account.presentation.dtos.UserResponse;

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
                    if (accountRepository.count() == 0) newAccount.addRole(Role.ADMIN);
                    return accountRepository.save(newAccount);
                });
    }

    public Account findAccount(Long id){
        return accountRepository.findById(id).orElseThrow(AccountNotFound::new);
    }

    @Transactional
    public UserResponse addRole(AccountPrincipal principal, Long id, Role role){
        requireAdmin(principal);
        Account account = accountRepository.findById(id).orElseThrow(AccountNotFound::new);
        account.addRole(role);
        return AccountMapper.toUserResponse(account);
    }

    @Transactional
    public UserResponse removeRole(AccountPrincipal principal, Long id, Role role){
        requireAdmin(principal);
        Account account = accountRepository.findById(id).orElseThrow(AccountNotFound::new);
        account.removeRole(role);
        return AccountMapper.toUserResponse(account);
    }

    @Transactional
    public AccountResponse updateProfile(Long id, PatchProfileRequest request){
        Account account = accountRepository.findById(id).orElseThrow(AccountNotFound::new);
        account.setName(request.name());
        return AccountMapper.toAccountResponse(accountRepository.save(account));
    }

    public void requireAdmin(AccountPrincipal principal){
        Account account = findAccount(principal.id());
        if (!account.hasRole(Role.ADMIN)) throw new AccessDeniedException("Access forbidden.");
    }

    public void requireAdminOrEditor(AccountPrincipal principal){
        Account account = findAccount(principal.id());
        if (!account.hasRole(Role.ADMIN) && !account.hasRole(Role.EDITOR)) throw new AccessDeniedException("Access forbidden.");
    }
}
