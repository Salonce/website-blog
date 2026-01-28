package salonce.dev.todolist.course.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import salonce.dev.todolist.account.infrastructure.security.AccountPrincipal;
import salonce.dev.todolist.course.application.CourseService;
import salonce.dev.todolist.course.application.LessonService;
import salonce.dev.todolist.course.presentation.dtos.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class CourseController {

    private final CourseService courseService;
    private final LessonService lessonService;

    @GetMapping("/api/courses")
    public ResponseEntity<List<CourseMetadataResponse>> getAllCourseViewResponses(){
        return ResponseEntity.ok(courseService.getAllCoursesMetadata());
    }

    @GetMapping("/api/courses/{id}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable Long id){
        return ResponseEntity.ok(courseService.getCourseViewById(id));
    }

    @GetMapping("/api/courses/slug/{slug}")
    public ResponseEntity<CourseResponse> getCourseViewResponse(@PathVariable String slug){
        return ResponseEntity.ok(courseService.getCourseBySlug(slug));
    }

//    @PatchMapping("/api/articles/{id}")
//    public ResponseEntity<CourseViewResponse> PatchCourse(@AuthenticationPrincipal AccountPrincipal principal, @RequestBody CourseCreateRequest articleCreateRequest, @PathVariable Long id){
//        return ResponseEntity.ok(courseService.patchCourse(principal, articleCreateRequest, id));
//    }

    @DeleteMapping("/api/courses/{id}")
    public ResponseEntity<Void> deleteCourse(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long id){
        courseService.deleteCourse(principal, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/courses")
    public ResponseEntity<CourseResponse> saveCourse(@AuthenticationPrincipal AccountPrincipal principal, @RequestBody CourseCreateRequest courseCreateRequest){
        return ResponseEntity.ok(courseService.saveCourse(principal, courseCreateRequest));
    }

    @PostMapping("/api/courses/{courseId}/lessons")
    public ResponseEntity<LessonMetadataResponse> saveLesson(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long courseId, @RequestBody LessonCreateRequest lessonCreateRequest){
        return ResponseEntity.ok(lessonService.saveLesson(principal, courseId, lessonCreateRequest));
    }

    @GetMapping("/api/courses/slug/{courseSlug}/lessons")
    public ResponseEntity<List<LessonMetadataResponse>> getLessonsByCourseSlug(@PathVariable String courseSlug){
        List<LessonMetadataResponse> lessons = lessonService.getLessonsMetadataByCourseSlug(courseSlug);
        return ResponseEntity.ok(lessons);
    }
}
