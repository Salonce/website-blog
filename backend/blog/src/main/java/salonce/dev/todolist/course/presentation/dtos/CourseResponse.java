package salonce.dev.todolist.course.presentation.dtos;

import java.util.List;

public record CourseResponse(Long id, String name, String slug, Integer orderId, List<LessonMetadataResponse> lessons){};
