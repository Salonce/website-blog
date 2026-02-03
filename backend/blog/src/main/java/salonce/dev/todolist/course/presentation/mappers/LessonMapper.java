package salonce.dev.todolist.course.presentation.mappers;

import salonce.dev.todolist.course.domain.Lesson;
import salonce.dev.todolist.course.presentation.dtos.LessonMetadataResponse;
import salonce.dev.todolist.course.presentation.dtos.LessonResponse;

import java.util.Collections;

public class LessonMapper {
    public static LessonMetadataResponse toLessonMetadataResponse(Lesson lesson){
        return new LessonMetadataResponse(lesson.getId(), lesson.getTitle(), lesson.getSlug(), lesson.getOrderId());
    }

    public static LessonResponse toLessonResponse(Lesson lesson){
        return new LessonResponse(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getSlug(),
                lesson.getOrderId(),
                lesson.getContentBlocks() == null
                        ? Collections.emptyList()
                        : lesson.getContentBlocks().stream()
                        .map(ContentBlockMapper::toContentBlockResponse)
                        .toList()
        );

    }
}
