package salonce.dev.website.account.domain;

import jakarta.persistence.*;
import lombok.Getter;


@Embeddable
@Getter
public class Identity {

    protected Identity() {}
    public Identity(String provider, String subject) {
        this.provider = provider;
        this.subject = subject;
    }

    private String provider;
    private String subject;
}
