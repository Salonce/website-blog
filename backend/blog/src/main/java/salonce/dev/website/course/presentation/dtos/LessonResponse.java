package salonce.dev.website.course.presentation.dtos;

import java.util.List;

public record LessonResponse(Long id, String title, String slug, Integer position, List<ContentBlockResponse> contentBlocks) {
}
