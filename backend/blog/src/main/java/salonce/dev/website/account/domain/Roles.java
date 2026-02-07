package salonce.dev.website.account.domain;

import jakarta.persistence.*;

import java.util.*;
import java.util.stream.Collectors;

@Embeddable
public class Roles {

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "account_roles", joinColumns = @JoinColumn(name = "account_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Set<Role> values = new HashSet<>();

    protected Roles() {}

    public Roles(Set<Role> roles) {
        this.values = new HashSet<>(roles);
    }

    public static Roles of(Role... roles) {
        return new Roles(new HashSet<>(Arrays.asList(roles)));
    }

    public void addRole(Role role) {
        values.add(role);
    }

    public void removeRole(Role role) {
        values.remove(role);
    }

    public boolean hasRole(Role role) {
        return values.contains(role);
    }

    public Set<Role> getValues() {
        return Collections.unmodifiableSet(values);
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
}