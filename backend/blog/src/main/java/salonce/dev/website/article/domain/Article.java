package salonce.dev.website.article.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import salonce.dev.website.account.domain.Account;

import java.time.LocalDateTime;


@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
public class Article {

    @Id
    @GeneratedValue
    private Long id;

    @Setter
    private String title;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Column(nullable = false, unique = true)
    private String slug;

    @Lob
    @Setter
    private String content;

    @JoinColumn
    @ManyToOne(fetch = FetchType.EAGER)
    private Account author;

    protected Article(){}

    public Article(String title, String slug, String content, Account author) {
        this.title = title;
        this.content = content;
        this.slug = slug;
        this.author = author;
    }
}
