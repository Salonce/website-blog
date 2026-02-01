package salonce.dev.todolist.course.presentation.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import salonce.dev.todolist.account.infrastructure.security.AccountPrincipal;
import salonce.dev.todolist.course.application.CourseService;
import salonce.dev.todolist.course.presentation.dtos.LessonCreateRequest;
import salonce.dev.todolist.course.presentation.dtos.LessonMetadataResponse;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class LessonController {

    private final CourseService courseService;


    @GetMapping("/api/courses/slug/{courseSlug}/lessons")
    public ResponseEntity<List<LessonMetadataResponse>> getLessonsByCourseSlug(@PathVariable String courseSlug){
        List<LessonMetadataResponse> lessons = courseService.getLessonsMetadataByCourseSlug(courseSlug);
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/api/courses/{courseId}/lessons")
    public ResponseEntity<List<LessonMetadataResponse>> getLessonsByCourseId(@PathVariable Long courseId){
        List<LessonMetadataResponse> lessons = courseService.getLessonsMetadataById(courseId);
        return ResponseEntity.ok(lessons);
    }

    @PostMapping("/api/courses/{courseId}/lessons")
    public ResponseEntity<LessonMetadataResponse> saveLesson(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long courseId, @RequestBody LessonCreateRequest lessonCreateRequest){
        return ResponseEntity.ok(courseService.saveLesson(principal, courseId, lessonCreateRequest));
    }

    @DeleteMapping("/api/lessons/{id}")
    public ResponseEntity<Void> deleteLesson(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long id){
        courseService.deleteLesson(principal, id);
        return ResponseEntity.noContent().build();
    }
}
