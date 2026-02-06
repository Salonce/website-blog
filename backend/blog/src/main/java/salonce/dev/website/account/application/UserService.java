package salonce.dev.website.account.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import salonce.dev.website.account.domain.Account;
import salonce.dev.website.account.infrastructure.AccountRepository;
import salonce.dev.website.account.infrastructure.security.AccountPrincipal;
import salonce.dev.website.account.presentation.AccountMapper;
import salonce.dev.website.account.presentation.AccountNotFound;
import salonce.dev.website.account.presentation.dtos.UserResponse;
import salonce.dev.website.account.presentation.dtos.UserUpdateRequest;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UserService {
    private final AccountRepository accountRepository;
    private final AccountService accountService;

    public List<UserResponse> getAllUsers(AccountPrincipal principal){
        accountService.requireAdmin(principal);
        return accountRepository.findAll().stream().map(AccountMapper::toUserResponse).toList();
    }

    public UserResponse getUser(AccountPrincipal principal, Long id){
        accountService.requireAdmin(principal);
        Account account = accountRepository.findById(id).orElseThrow(AccountNotFound::new);
        return AccountMapper.toUserResponse(account);
    }

    public UserResponse updateUser(AccountPrincipal principal, Long id, UserUpdateRequest request){
        accountService.requireAdmin(principal);
        Account account = accountRepository.findById(id).orElseThrow(AccountNotFound::new);
        // HERE UPDATE USER
        return AccountMapper.toUserResponse(account);
    }
}
