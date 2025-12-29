package salonce.dev.todolist.account.domain;

import jakarta.persistence.*;

import java.util.Collections;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Embeddable
public class Roles {

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "account_roles", joinColumns = @JoinColumn(name = "account_id"))
    private Set<Role> values = new HashSet<>();

    protected Roles() {}

    public Roles(Set<Role> roles) {
        this.values = new HashSet<>(roles);
    }

    public static Roles of(Role... roles) {
        Roles r = new Roles();
        for (Role role : roles) {
            r.addRole(role);
        }
        return r;
    }

    public void addRole(Role role) {
        values.add(role);
    }

    public boolean hasRole(Role role) {
        return values.contains(role);
    }

    public void removeRole(Role role) {
        values.remove(role);
    }

    public Set<Role> getValues() {
        return Collections.unmodifiableSet(values);
    }

    public void addAdminRole() {
        addRole(Role.ADMIN);
    }

    public void addUserRole() {
        addRole(Role.USER);
    }

    public void addModeratorRole() {
        addRole(Role.MODERATOR);
    }

    public void removeAdminRole() {
        removeRole(Role.ADMIN);
    }

    public void removeUserRole() {
        removeRole(Role.USER);
    }

    public void removeModeratorRole() {
        removeRole(Role.MODERATOR);
    }

    public boolean isAdmin() {
        return hasRole(Role.ADMIN);
    }

    public boolean isUser() {
        return hasRole(Role.USER);
    }

    public boolean isModerator() {
        return hasRole(Role.MODERATOR);
    }

    public Set<String> getNames() {
        return values.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Roles roles)) return false;
        return Objects.equals(values, roles.values);
    }

    @Override
    public int hashCode() {
        return Objects.hash(values);
    }

    @Override
    public String toString() {
        return values.toString();
    }
}