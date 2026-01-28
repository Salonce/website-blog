package salonce.dev.todolist.course.presentation;

import salonce.dev.todolist.course.domain.Lesson;
import salonce.dev.todolist.course.presentation.dtos.LessonMetadataViewResponse;

public class LessonMapper {
    public static LessonMetadataViewResponse toLessonViewResponse(Lesson lesson){
        return new LessonMetadataViewResponse(lesson.getId(), lesson.getTitle(), lesson.getSlug(), lesson.getOrderId());
    }
}
