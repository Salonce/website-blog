package salonce.dev.todolist.account.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@NoArgsConstructor
@Getter
public class Account {

    public Account (String email, String name, String subject, String provider){
        this.email = email;
        this.name = name;
        this.addUserRole();
        identities.addIdentity(provider, subject);
    }

    @GeneratedValue
    @Id
    private Long id;

    @Setter
    private String name;

    @Setter
    private String email;

    @Setter
    @Embedded
    private Roles roles = new Roles();

    @Setter
    @Embedded
    private Identities identities = new Identities();

    public Boolean identityExists(String provider, String subject){
        return identities.identityExists(provider, subject);
    }

    public Set<String> getRoles(){
        return roles.getNames();
    }

    public void addAdminRole() {
        roles.addAdminRole();
    }

    public void addUserRole() {
        roles.addUserRole();
    }

    public Boolean isAdmin() {
        return roles.isAdmin();
    }

    public Boolean isUser() {
        return roles.isUser();
    }

    public Boolean isModerator() {
        return roles.isModerator();
    }

    public void addModeratorRole() {
        roles.addModeratorRole();
    }

    public void removeAdminRole() {
        roles.removeAdminRole();
    }

    public void removeUserRole() {
        roles.removeUserRole();
    }

    public void removeModeratorRole() {
        roles.removeModeratorRole();
    }
}
