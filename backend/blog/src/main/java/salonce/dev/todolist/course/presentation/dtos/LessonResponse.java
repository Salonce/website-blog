package salonce.dev.todolist.course.presentation.dtos;

import salonce.dev.todolist.course.domain.ContentBlock;

import java.util.List;

public record LessonResponse(Long id, String title, String slug, Integer orderId, List<ContentBlockResponse> contentBlocks) {
}
