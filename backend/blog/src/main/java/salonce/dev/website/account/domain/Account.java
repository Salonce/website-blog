package salonce.dev.website.account.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@NoArgsConstructor
@Getter
public class Account {

    public Account(String email, String name, String subject, String provider) {
        this.email = email;
        this.name = name;
        this.roles.addRole(Role.USER);  // Default role
        identities.addIdentity(provider, subject);
    }

    @GeneratedValue
    @Id
    private Long id;

    @Setter
    private String name;

    @Setter
    private String email;

    @Embedded
    private Roles roles = new Roles();

    @Setter
    @Embedded
    private Identities identities = new Identities();

    public void addRole(Role role) {
        roles.addRole(role);
    }

    public void removeRole(Role role) {
        roles.removeRole(role);
    }

    public boolean hasRole(Role role) {
        return roles.hasRole(role);
    }

    public Set<Role> getRoles() {
        return roles.getValues();
    }

    public Set<String> getRoleNames() {
        return roles.getNames();
    }

    public boolean identityExists(String provider, String subject) {
        return identities.identityExists(provider, subject);
    }
}
