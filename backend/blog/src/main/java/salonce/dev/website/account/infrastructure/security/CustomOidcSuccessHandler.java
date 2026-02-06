package salonce.dev.website.account.infrastructure.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import salonce.dev.website.account.application.AccountService;
import salonce.dev.website.account.application.AccountDto;
import salonce.dev.website.account.domain.Account;

import java.io.IOException;

@RequiredArgsConstructor
@Component
public class CustomOidcSuccessHandler implements AuthenticationSuccessHandler {

    private final AccountService accountService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2AuthenticationToken oauth2 = (OAuth2AuthenticationToken) authentication;
        String provider = oauth2.getAuthorizedClientRegistrationId();

        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();

        String subject = oidcUser.getSubject();
        String email = oidcUser.getEmail();
        String name = oidcUser.getGivenName();

        AccountDto accountDto = new AccountDto(email, name, subject, provider);
        Account account = accountService.loadOrCreateAccount(accountDto);
        AccountPrincipal accountPrincipal = new AccountPrincipal(account.getId(), account.getEmail(), account.getRoles());

        Authentication auth = new UsernamePasswordAuthenticationToken(
                accountPrincipal,
                null,
                authentication.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(auth);
        System.out.printf(frontendUrl);
        response.sendRedirect(frontendUrl);
    }
}
