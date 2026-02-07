package salonce.dev.website.account.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import salonce.dev.website.account.domain.Account;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    @Query("SELECT a FROM Account a JOIN a.identities.items i WHERE i.provider = :provider AND i.subject =:subject")
    Optional<Account> findByIdentity(@Param("subject") String subject, @Param("provider") String provider);
}
