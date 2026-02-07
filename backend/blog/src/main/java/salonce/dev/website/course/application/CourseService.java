package salonce.dev.website.course.application;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import salonce.dev.website.account.application.AccountService;
import salonce.dev.website.account.infrastructure.security.AccountPrincipal;
import salonce.dev.website.course.domain.ContentBlock;
import salonce.dev.website.course.infrastructure.ContentBlockRepository;
import salonce.dev.website.course.presentation.ContentBlockNotFound;
import salonce.dev.website.course.presentation.CourseNotFound;
import salonce.dev.website.course.domain.Course;
import salonce.dev.website.course.domain.Lesson;
import salonce.dev.website.course.infrastructure.CourseRepository;
import salonce.dev.website.course.infrastructure.LessonRepository;
import salonce.dev.website.course.presentation.LessonNotFound;
import salonce.dev.website.course.presentation.mappers.ContentBlockMapper;
import salonce.dev.website.course.presentation.mappers.CourseMapper;
import salonce.dev.website.course.presentation.mappers.LessonMapper;
import salonce.dev.website.course.presentation.dtos.*;

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
        return courseRepository.findAllCourseViewsOrderByPosition().stream().toList();
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
    public void deleteCourse(AccountPrincipal principal, Long courseId) {
        accountService.requireAdminOrEditor(principal);
        Course course = courseRepository.findById(courseId).orElseThrow(CourseNotFound::new);
        int deletedPosition = course.getPosition();
        courseRepository.delete(course);
        courseRepository.shiftPositionsAfterDeletion(deletedPosition);
    }

    private int getNextCourseOrderIndex() {
        return courseRepository
                .findTopByOrderByPositionDesc()
                .map(course -> course.getPosition() + 1)
                .orElse(1);
    }

    @Transactional
    public void reorderCourses(AccountPrincipal principal, ReorderRequest request) {
        accountService.requireAdminOrEditor(principal);
        List<Long> orderedCourseIds = request.ids();
        for (int i = 0; i < orderedCourseIds.size(); i++) {
            Long courseId = orderedCourseIds.get(i);
            Course course = courseRepository.findById(courseId).orElseThrow(CourseNotFound::new);
            course.setPosition(i + 1);
            courseRepository.save(course);
        }
    }

    // LESSONS

    @Transactional
    public void reorderLessons(AccountPrincipal principal, ReorderRequest request) {
        accountService.requireAdminOrEditor(principal);
        List<Long> orderedLessonIds = request.ids();
        for (int i = 0; i < orderedLessonIds.size(); i++) {
            Long lessonId = orderedLessonIds.get(i);
            Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(LessonNotFound::new);
            lesson.setPosition(i + 1);
            lessonRepository.save(lesson);
        }
    }


    @Transactional
    public LessonResponse getLessonById(AccountPrincipal principal, Long lessonId){
        accountService.requireAdminOrEditor(principal);
        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(LessonNotFound::new);
        return LessonMapper.toLessonResponse(lesson);
    }

    @Transactional
    public LessonResponse getLessonBySlugs(AccountPrincipal principal, String courseSlug, String lessonSlug){
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
    public void deleteLesson(AccountPrincipal principal, Long lessonId) {
        accountService.requireAdminOrEditor(principal);
        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(LessonNotFound::new);
        Integer deletedPosition = lesson.getPosition();
        Long courseId = lesson.getCourse().getId();
        lessonRepository.delete(lesson);
        lessonRepository.shiftPositionsAfterDeletion(courseId, deletedPosition);
    }

    @Transactional
    public LessonMetadataResponse saveLesson(AccountPrincipal principal, Long courseId, LessonCreateRequest lessonCreateRequest){
        accountService.requireAdminOrEditor(principal);
        int nextOrderIndex = lessonRepository.findMaxOrderIndex(courseId) + 1;
        Course course = courseRepository.findById(courseId).orElseThrow(CourseNotFound::new);
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
