package salonce.dev.website.course.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String title;

    @Setter
    private String slug;

    @Setter
    private Integer position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    void setCourse(Course course) {
        this.course = course;
    }

    protected Lesson() {}

    public Lesson(String title, String slug, int position) {
        this.title = title;
        this.slug = slug;
        this.position = position;
    }

    //Content blocks

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC")
    private List<ContentBlock> contentBlocks = new ArrayList<>();

    public void addContentBlock(ContentBlock block) {
        contentBlocks.add(block);
        block.setLesson(this);
    }

    public void removeContentBlock(ContentBlock block) {
        contentBlocks.remove(block);
        block.setLesson(null);
    }
}