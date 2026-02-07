package salonce.dev.website.course.presentation.dtos;

import java.util.List;

public record CourseResponse(Long id, String name, String slug, Integer position, List<LessonMetadataResponse> lessons){};
