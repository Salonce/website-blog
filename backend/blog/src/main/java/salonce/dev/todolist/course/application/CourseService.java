package salonce.dev.todolist.course.application;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import salonce.dev.todolist.account.application.AccountService;
import salonce.dev.todolist.account.domain.Account;
import salonce.dev.todolist.account.infrastructure.security.AccountPrincipal;
import salonce.dev.todolist.article.application.exceptions.ArticleNotFound;
import salonce.dev.todolist.course.application.exceptions.CourseNotFound;
import salonce.dev.todolist.course.domain.Course;
import salonce.dev.todolist.course.infrastructure.CourseRepository;
import salonce.dev.todolist.course.presentation.CourseMapper;
import salonce.dev.todolist.course.presentation.dtos.CourseCreateRequest;
import salonce.dev.todolist.course.presentation.dtos.CourseMetadataResponse;
import salonce.dev.todolist.course.presentation.dtos.CourseResponse;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CourseService {

    private final AccountService accountService;
    private final CourseRepository courseRepository;

    @Transactional
    public List<CourseMetadataResponse> getAllCoursesMetadata(){
        return courseRepository.findAllCourseViews().stream().toList();
    }

    @Transactional
    public Course getCourseById(Long id){
        return courseRepository.findById(id).orElseThrow(CourseNotFound::new);
    }

    @Transactional
    public CourseResponse getCourseViewById(Long id){
        Course course = courseRepository.findById(id).orElseThrow(CourseNotFound::new);
        return CourseMapper.toCourseViewResponse(course);
    }

    @Transactional
    public CourseResponse getCourseBySlug(String slug){
        Course course = courseRepository.findBySlug(slug).orElseThrow(CourseNotFound::new);
        return CourseMapper.toCourseViewResponse(course);
    }

    @Transactional
    public CourseResponse saveCourse(AccountPrincipal principal, CourseCreateRequest courseCreateRequest){
        Account account = accountService.findAccount(principal.id());
        if (!account.isAdmin()) throw new AccessDeniedException("Access forbidden.");
        Course course = new Course(courseCreateRequest.name(), generateSlug(courseCreateRequest.name()), getNextOrderIndex());
        return CourseMapper.toCourseViewResponse(courseRepository.save(course));
    }

    @Transactional
    public void deleteCourse(AccountPrincipal principal, Long courseId){
        Account account = accountService.findAccount(principal.id());
        if (!account.isAdmin()) throw new AccessDeniedException("Access forbidden.");
        Course course = courseRepository.findById(courseId).orElseThrow(ArticleNotFound::new);
        courseRepository.delete(course);
    }

    private int getNextOrderIndex() {
        return courseRepository
                .findTopByOrderByOrderIdDesc()
                .map(course -> course.getOrderId() + 1)
                .orElse(1);
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");
    }
}
