package salonce.dev.todolist.course.presentation;

import salonce.dev.todolist.course.domain.Course;
import salonce.dev.todolist.course.presentation.dtos.CourseResponse;
import salonce.dev.todolist.course.presentation.dtos.LessonMetadataResponse;

public class CourseMapper {
    public static CourseResponse toCourseViewResponse(Course course){
        return new CourseResponse(
                course.getId(),
                course.getName(),
                course.getSlug(),
                course.getOrderId(),
                course.getLessons().stream()
                        .map(l -> new LessonMetadataResponse(
                                l.getId(),
                                l.getTitle(),
                                l.getSlug(),
                                l.getOrderId())
                        ).toList()
        );
    }
}
