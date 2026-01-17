package salonce.dev.todolist.course.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import salonce.dev.todolist.account.infrastructure.security.AccountPrincipal;
import salonce.dev.todolist.course.application.CourseService;
import salonce.dev.todolist.course.presentation.dtos.CourseCreateRequest;
import salonce.dev.todolist.course.presentation.dtos.CourseViewResponse;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class CourseController {

    private final CourseService courseService;

    @GetMapping("/api/courses")
    public ResponseEntity<List<CourseViewResponse>> getAllCourseViewResponses(){
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/api/courses/{id}")
    public ResponseEntity<CourseViewResponse> getCourseById(@PathVariable Long id){
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/api/courses/{slug}")
    public ResponseEntity<CourseViewResponse> getCourseViewResponse(@PathVariable String slug){
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
    public ResponseEntity<CourseViewResponse> saveCourse(@AuthenticationPrincipal AccountPrincipal principal, @RequestBody CourseCreateRequest courseCreateRequest){
        return ResponseEntity.ok(courseService.saveCourse(principal, courseCreateRequest));
    }

}
