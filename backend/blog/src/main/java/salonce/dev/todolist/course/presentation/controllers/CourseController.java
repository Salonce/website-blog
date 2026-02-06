package salonce.dev.todolist.course.presentation.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import salonce.dev.todolist.account.infrastructure.security.AccountPrincipal;
import salonce.dev.todolist.course.application.CourseService;
import salonce.dev.todolist.course.presentation.dtos.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class CourseController {

    private final CourseService courseService;

    @GetMapping("/api/courses")
    public ResponseEntity<List<CourseMetadataResponse>> getAllCourseViewResponses(){
        return ResponseEntity.ok(courseService.getAllCoursesMetadata());
    }

    @PostMapping("/api/courses")
    public ResponseEntity<CourseResponse> saveCourse(@AuthenticationPrincipal AccountPrincipal principal, @RequestBody CourseCreateRequest courseCreateRequest){
        return ResponseEntity.ok(courseService.saveCourse(principal, courseCreateRequest));
    }

    @GetMapping("/api/courses/{id}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable Long id){
        return ResponseEntity.ok(courseService.getCourseResponseById(id));
    }

    @PatchMapping("/api/courses/{id}")
    public ResponseEntity<CourseResponse> updateCourse(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long id, @RequestBody CourseUpdateRequest courseUpdateRequest){
        return ResponseEntity.ok(courseService.updateCourse(principal, id, courseUpdateRequest));
    }

    @DeleteMapping("/api/courses/{id}")
    public ResponseEntity<Void> deleteCourse(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long id){
        courseService.deleteCourse(principal, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/courses/slug/{slug}")
    public ResponseEntity<CourseResponse> getCourseViewResponse(@PathVariable String slug){
        return ResponseEntity.ok(courseService.getCourseBySlug(slug));
    }
}
