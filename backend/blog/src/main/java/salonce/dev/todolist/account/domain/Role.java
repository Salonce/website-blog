package salonce.dev.todolist.account.domain;

public enum Role {
    ADMIN("ADMIN"),
    MODERATOR("MODERATOR"),
    EDITOR("EDITOR"),
    USER("USER");

    private final String name;

    Role(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
