package salonce.dev.website.article.presentation;

import salonce.dev.website.article.domain.Article;
import salonce.dev.website.article.presentation.dtos.ArticleViewResponse;

public class ArticleMapper {
    public static ArticleViewResponse toArticleResponse(Article article){
        return new ArticleViewResponse(article.getId(), article.getTitle(), article.getSlug(), article.getContent(), article.getAuthor().getName(), article.getCreatedAt(), article.getUpdatedAt());
    }
}
