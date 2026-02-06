package salonce.dev.website.task.domain;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
public class Task{

    @GeneratedValue
    @Id
    private Long id;

    @Setter
    private String description;

    @Setter
    private Boolean completed;

    @Setter
    @Column(name = "account_id")
    private Long accountId;
}
