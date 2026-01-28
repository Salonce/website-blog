package salonce.dev.todolist.course.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Embeddable;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Embeddable
public class Lessons {

    @Getter
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderId ASC")
    private List<Lesson> lessons = new ArrayList<>();

    public void addLesson(Lesson lesson, Course course) {
        lesson.setCourse(course);
        lessons.add(lesson);
    }

    public void removeLesson(Lesson lesson) {
        lessons.remove(lesson);
        lesson.setCourse(null);
    }
}
