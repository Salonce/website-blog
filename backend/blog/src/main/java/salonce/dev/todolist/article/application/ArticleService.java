package salonce.dev.todolist.article.application;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import salonce.dev.todolist.account.application.AccountService;
import salonce.dev.todolist.account.domain.Account;
import salonce.dev.todolist.account.domain.Role;
import salonce.dev.todolist.account.infrastructure.security.AccountPrincipal;
import salonce.dev.todolist.article.application.exceptions.ArticleNotFound;
import salonce.dev.todolist.article.domain.Article;
import salonce.dev.todolist.article.infrastructure.ArticleRepository;
import salonce.dev.todolist.article.presentation.ArticleMapper;
import salonce.dev.todolist.article.presentation.dtos.ArticleCreateRequest;
import salonce.dev.todolist.article.presentation.dtos.ArticleViewResponse;


@Service
@RequiredArgsConstructor
public class ArticleService {

    private final AccountService accountService;
    private final ArticleRepository articleRepository;

    @Transactional
    public Page<ArticleViewResponse> getAllArticles(Pageable pageable){
        return articleRepository.findAll(pageable).map(ArticleMapper::toArticleResponse);
    }

    @Transactional
    public ArticleViewResponse getArticle(String slug){
        Article article = articleRepository.findBySlug(slug).orElseThrow(ArticleNotFound::new);
        return ArticleMapper.toArticleResponse(article);
    }

    @Transactional
    public ArticleViewResponse getArticle(Long id){
        Article article = articleRepository.findById(id).orElseThrow(ArticleNotFound::new);
        return ArticleMapper.toArticleResponse(article);
    }

    @Transactional
    public ArticleViewResponse saveArticle(AccountPrincipal principal, ArticleCreateRequest articleCreateRequest){
        Account account = accountService.findAccount(principal.id());
        accountService.requireAdminOrEditor(principal);
        Article article = new Article(articleCreateRequest.title(), generateSlug(articleCreateRequest.title()), articleCreateRequest.content(), account);
        return ArticleMapper.toArticleResponse(articleRepository.save(article));
    }

    @Transactional
    public ArticleViewResponse patchArticle(AccountPrincipal principal, ArticleCreateRequest articleCreateRequest, Long articleId){
        accountService.requireAdminOrEditor(principal);
        Article article = articleRepository.findById(articleId).orElseThrow(ArticleNotFound::new);

        if (articleCreateRequest.title() != null) article.setTitle(articleCreateRequest.title());
        if (articleCreateRequest.content() != null) article.setContent(articleCreateRequest.content());

        return ArticleMapper.toArticleResponse(articleRepository.save(article));
    }

    @Transactional
    public void deleteArticle(AccountPrincipal principal, Long articleId){
        accountService.requireAdminOrEditor(principal);
        Article article = articleRepository.findById(articleId).orElseThrow(ArticleNotFound::new);
        articleRepository.delete(article);
    }


    private String generateSlug(String title) {
        return title.toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");
    }
}
