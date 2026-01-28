package salonce.dev.todolist.course.domain;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String slug;

    private int orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    // Package-private setter for aggregate root management
    void setCourse(Course course) {
        this.course = course;
    }

    protected Lesson() {} // JPA

    public Lesson(String title, String slug, int orderId) {
        this.title = title;
        this.slug = slug;
        this.orderId = orderId;
    }
}