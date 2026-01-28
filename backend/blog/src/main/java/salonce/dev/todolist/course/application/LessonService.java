package salonce.dev.todolist.course.application;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import salonce.dev.todolist.account.application.AccountService;
import salonce.dev.todolist.account.domain.Account;
import salonce.dev.todolist.account.infrastructure.security.AccountPrincipal;
import salonce.dev.todolist.course.domain.Course;
import salonce.dev.todolist.course.domain.Lesson;
import salonce.dev.todolist.course.infrastructure.LessonRepository;
import salonce.dev.todolist.course.presentation.LessonMapper;
import salonce.dev.todolist.course.presentation.dtos.LessonCreateRequest;
import salonce.dev.todolist.course.presentation.dtos.LessonMetadataResponse;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final AccountService accountService;
    private final CourseService courseService;
    private final LessonRepository lessonRepository;

    @Transactional
    public LessonMetadataResponse saveLesson(AccountPrincipal principal, Long courseId, LessonCreateRequest lessonCreateRequest){
        Account account = accountService.findAccount(principal.id());
        if (!account.isAdmin()) throw new AccessDeniedException("Access forbidden.");
        int nextOrderIndex = lessonRepository.findMaxOrderIndex(courseId) + 1;
        Course course = courseService.getCourseById(courseId);
        Lesson lesson = new Lesson(lessonCreateRequest.title(), generateSlug(lessonCreateRequest.title()), nextOrderIndex);
        course.addLesson(lesson);
        return LessonMapper.toLessonViewResponse(lessonRepository.save(lesson));
    }

    public List<LessonMetadataResponse> getLessonsMetadataByCourseSlug(String courseSlug){
         return lessonRepository.findAllMetadataByCourseSlug(courseSlug);
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");
    }
}
