package salonce.dev.website.course.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
public class TextBlock extends ContentBlock {

    @Setter
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    public TextBlock(String content) {
        this.content = content;
    }

    public TextBlock() {
        this.content = content;
    }

    @Override
    public String type() {
        return "TEXT";
    }
}
