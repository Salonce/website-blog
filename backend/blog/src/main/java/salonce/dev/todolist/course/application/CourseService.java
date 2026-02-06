package salonce.dev.todolist.course.application;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import salonce.dev.todolist.account.application.AccountService;
import salonce.dev.todolist.account.domain.Account;
import salonce.dev.todolist.account.domain.Role;
import salonce.dev.todolist.account.infrastructure.security.AccountPrincipal;
import salonce.dev.todolist.course.domain.ContentBlock;
import salonce.dev.todolist.course.infrastructure.ContentBlockRepository;
import salonce.dev.todolist.course.presentation.ContentBlockNotFound;
import salonce.dev.todolist.course.presentation.CourseNotFound;
import salonce.dev.todolist.course.domain.Course;
import salonce.dev.todolist.course.domain.Lesson;
import salonce.dev.todolist.course.infrastructure.CourseRepository;
import salonce.dev.todolist.course.infrastructure.LessonRepository;
import salonce.dev.todolist.course.presentation.LessonNotFound;
import salonce.dev.todolist.course.presentation.mappers.ContentBlockMapper;
import salonce.dev.todolist.course.presentation.mappers.CourseMapper;
import salonce.dev.todolist.course.presentation.mappers.LessonMapper;
import salonce.dev.todolist.course.presentation.dtos.*;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CourseService {

    private final AccountService accountService;
    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final ContentBlockRepository contentBlockRepository;

    @Transactional
    public List<CourseMetadataResponse> getAllCoursesMetadata(){
        return courseRepository.findAllCourseViews().stream().toList();
    }

    @Transactional
    public Course getCourseById(Long id){
        return courseRepository.findById(id).orElseThrow(CourseNotFound::new);
    }

    @Transactional
    public CourseResponse getCourseResponseById(Long id){
        Course course = courseRepository.findById(id).orElseThrow(CourseNotFound::new);
        return CourseMapper.toCourseResponse(course);
    }

    @Transactional
    public CourseResponse getCourseBySlug(String slug){
        Course course = courseRepository.findBySlug(slug).orElseThrow(CourseNotFound::new);
        return CourseMapper.toCourseResponse(course);
    }

    @Transactional
    public CourseResponse updateCourse(AccountPrincipal principal, Long id, CourseUpdateRequest request){
        accountService.requireAdminOrEditor(principal);
        Course course = courseRepository.findById(id).orElseThrow(CourseNotFound::new);
        if (request.name() != null) course.setName(request.name());
        if (request.slug() != null) course.setSlug(request.slug());
        return CourseMapper.toCourseResponse(course);
    }

    @Transactional
    public CourseResponse saveCourse(AccountPrincipal principal, CourseCreateRequest courseCreateRequest){
        accountService.requireAdminOrEditor(principal);
        Course course = new Course(courseCreateRequest.name(), generateSlug(courseCreateRequest.name()), getNextCourseOrderIndex());
        return CourseMapper.toCourseResponse(courseRepository.save(course));
    }

    @Transactional
    public void deleteCourse(AccountPrincipal principal, Long courseId){
        accountService.requireAdminOrEditor(principal);
        Course course = courseRepository.findById(courseId).orElseThrow(CourseNotFound::new);
        courseRepository.delete(course);
    }

    private int getNextCourseOrderIndex() {
        return courseRepository
                .findTopByOrderByOrderIdDesc()
                .map(course -> course.getOrderId() + 1)
                .orElse(1);
    }

    // LESSONS

    @Transactional
    public LessonResponse getLessonById(AccountPrincipal principal, Long lessonId){
        accountService.requireAdminOrEditor(principal);
        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(LessonNotFound::new);
        return LessonMapper.toLessonResponse(lesson);
    }

    @Transactional
    public LessonResponse getLessonBySlugs(AccountPrincipal principal, String courseSlug, String lessonSlug){
        accountService.requireAdminOrEditor(principal);
        Lesson lesson = lessonRepository.findByCourseSlugAndLessonSlug(courseSlug, lessonSlug).orElseThrow(LessonNotFound::new);
        return LessonMapper.toLessonResponse(lesson);
    }

    @Transactional
    public LessonResponse updateLesson(AccountPrincipal principal, Long id, LessonUpdateRequest request){
        accountService.requireAdminOrEditor(principal);
        Lesson lesson = lessonRepository.findById(id).orElseThrow(LessonNotFound::new);
        if (request.title() != null) lesson.setTitle(request.title());
        if (request.slug() != null) lesson.setSlug(request.slug());
        return LessonMapper.toLessonResponse(lesson);
    }

    @Transactional
    public void deleteLesson(AccountPrincipal principal, Long lessonId){
        accountService.requireAdminOrEditor(principal);
        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(LessonNotFound::new);
        lessonRepository.delete(lesson);
    }

    @Transactional
    public LessonMetadataResponse saveLesson(AccountPrincipal principal, Long courseId, LessonCreateRequest lessonCreateRequest){
        accountService.requireAdminOrEditor(principal);
        int nextOrderIndex = lessonRepository.findMaxOrderIndex(courseId) + 1;
        Course course = getCourseById(courseId);
        Lesson lesson = new Lesson(lessonCreateRequest.title(), generateSlug(lessonCreateRequest.title()), nextOrderIndex);
        course.addLesson(lesson);
        courseRepository.save(course);
        return LessonMapper.toLessonMetadataResponse(lesson);
    }

    public List<LessonMetadataResponse> getLessonsMetadataByCourseSlug(String courseSlug){
        return lessonRepository.findAllMetadataByCourseSlug(courseSlug);
    }

    public List<LessonMetadataResponse> getLessonsMetadataById(Long courseId){
        return lessonRepository.findAllMetadataByCourseId(courseId);
    }

    // BLOCKS

    @Transactional
    public List<ContentBlockResponse> getContentBlocksByLessonId(Long lessonId){
        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(LessonNotFound::new);
        List<ContentBlock> contentBlocks = lesson.getContentBlocks();
        return contentBlocks.stream().map(ContentBlockMapper::toContentBlockResponse).toList();
    }

    @Transactional
    public ContentBlockResponse saveContentBlock(Long lessonId, ContentBlockCreateRequest contentBlockCreateRequest, AccountPrincipal principal){
        accountService.requireAdminOrEditor(principal);
        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(LessonNotFound::new);
        ContentBlock contentBlock = ContentBlockMapper.createBlockFromRequest(contentBlockCreateRequest);
        lesson.addContentBlock(contentBlock);
        int lastPosition = contentBlockRepository.findMaxPositionByLessonId(lessonId);
        contentBlock.setPosition(lastPosition + 1);
        contentBlockRepository.save(contentBlock);
        return ContentBlockMapper.toContentBlockResponse(contentBlock);
    }

    @Transactional
    public ContentBlockResponse updateContentBlock(Long blockId, ContentBlockUpdateRequest updateRequest, AccountPrincipal principal) {
        accountService.requireAdminOrEditor(principal);
        ContentBlock contentBlock = contentBlockRepository.findById(blockId).orElseThrow(ContentBlockNotFound::new);
        ContentBlockMapper.updateBlockFromRequest(contentBlock, updateRequest);
        return ContentBlockMapper.toContentBlockResponse(contentBlock);
    }

    @Transactional public void removeContentBlock(Long blockId, AccountPrincipal principal){
        accountService.requireAdminOrEditor(principal);
        ContentBlock contentBlock = contentBlockRepository.findById(blockId).orElseThrow(ContentBlockNotFound::new);
        contentBlockRepository.delete(contentBlock);
    }

    // UTIL

    private String generateSlug(String name) {
        return name.toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");
    }
}
