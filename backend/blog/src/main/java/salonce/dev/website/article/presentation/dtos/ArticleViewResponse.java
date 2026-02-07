package salonce.dev.website.article.presentation.dtos;

import java.time.LocalDateTime;

public record ArticleViewResponse(Long id, String title, String slug, String content, String authorName, LocalDateTime createdAt, LocalDateTime updatedAt){
}
