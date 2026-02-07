package salonce.dev.website.account.domain;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Embeddable
public class Identities {

    @ElementCollection
    @CollectionTable(name = "account_identities", joinColumns = @JoinColumn(name = "account_id"))
    private final Set<Identity> items = new HashSet<>();

    public Boolean identityExists(String provider, String subject){
        return items.stream().anyMatch(identity -> (identity.getProvider().equals(provider) && identity.getSubject().equals(subject)));
    }

    public void addIdentity(String provider, String subject){
        Identity identity = new Identity(provider, subject);
        items.add(identity);
    }

    public void addIdentityIfAbsent(String provider, String subject) {
        if (!identityExists(provider, subject)) {
            addIdentity(provider, subject);
        }
    }
}
