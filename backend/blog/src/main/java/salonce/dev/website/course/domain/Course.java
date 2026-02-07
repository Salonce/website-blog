package salonce.dev.website.course.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Entity
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String name;

    @Setter
    private String slug;

    @Setter
    private Integer position;
    private Boolean published;

    protected Course() {}

    public Course(String name, String slug, int position) {
        this.name = name;
        this.slug = slug;
        this.position = position;
        this.published = false;
    }

    @Setter
    @Embedded
    private Lessons lessons = new Lessons();

    public List<Lesson> getLessons(){ return lessons.getLessons(); }

    public void addLesson(Lesson lesson) {
        lessons.addLesson(lesson, this);
    }

    public void removeLesson(Lesson lesson) {
        lessons.removeLesson(lesson);
    }
}