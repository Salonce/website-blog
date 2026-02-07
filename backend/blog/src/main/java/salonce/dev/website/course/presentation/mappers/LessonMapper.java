package salonce.dev.website.course.presentation.mappers;

import salonce.dev.website.course.domain.Lesson;
import salonce.dev.website.course.presentation.dtos.LessonMetadataResponse;
import salonce.dev.website.course.presentation.dtos.LessonResponse;

import java.util.Collections;

public class LessonMapper {
    public static LessonMetadataResponse toLessonMetadataResponse(Lesson lesson){
        return new LessonMetadataResponse(lesson.getId(), lesson.getTitle(), lesson.getSlug(), lesson.getPosition());
    }

    public static LessonResponse toLessonResponse(Lesson lesson){
        return new LessonResponse(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getSlug(),
                lesson.getPosition(),
                lesson.getContentBlocks() == null
                        ? Collections.emptyList()
                        : lesson.getContentBlocks().stream()
                        .map(ContentBlockMapper::toContentBlockResponse)
                        .toList()
        );

    }
}
