package salonce.dev.todolist.course.presentation.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import salonce.dev.todolist.account.infrastructure.security.AccountPrincipal;
import salonce.dev.todolist.course.application.CourseService;
import salonce.dev.todolist.course.presentation.dtos.*;

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

    @GetMapping("/api/lessons/{id}")
    public ResponseEntity<LessonResponse> getLessonById(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long id){
        return ResponseEntity.ok(courseService.getLessonById(principal, id));
    }

    @PatchMapping("/api/lessons/{id}")
    public ResponseEntity<LessonResponse> updateLesson(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long id, @RequestBody LessonUpdateRequest lessonUpdateRequest){
        return ResponseEntity.ok(courseService.updateLesson(principal, id, lessonUpdateRequest));
    }

    @GetMapping("/api/courses/slug/{courseSlug}/lessons/slug/{lessonSlug}")
    public ResponseEntity<LessonResponse> getLessonBySlugs(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable String courseSlug, @PathVariable String lessonSlug){
        return ResponseEntity.ok(courseService.getLessonBySlugs(principal, courseSlug, lessonSlug));
    }

    @DeleteMapping("/api/lessons/{id}")
    public ResponseEntity<Void> deleteLesson(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long id){
        courseService.deleteLesson(principal, id);
        return ResponseEntity.noContent().build();
    }

    // Blocks

    @GetMapping("/api/lessons/{lessonId}/contentblocks")
    public ResponseEntity<List<ContentBlockResponse>> getBlocksByLessonId(@PathVariable Long lessonId){
        List<ContentBlockResponse> blocks = courseService.getContentBlocksByLessonId(lessonId);
        return ResponseEntity.ok(blocks);
    }

    @PostMapping("/api/lessons/{lessonId}/contentblocks")
    public ResponseEntity<ContentBlockResponse> saveBlock(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long lessonId, @RequestBody ContentBlockCreateRequest contentBlockCreateRequest){
        ContentBlockResponse block = courseService.saveContentBlock(lessonId, contentBlockCreateRequest, principal);
        return ResponseEntity.ok(block);
    }

    @DeleteMapping("/api/contentblocks/{blockId}")
    public ResponseEntity<Void> removeContentBlock(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long blockId){
        courseService.removeContentBlock(blockId, principal);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/api/contentblocks/{blockId}")
    public ResponseEntity<ContentBlockResponse> updateContentBlock(@PathVariable Long blockId, @RequestBody ContentBlockUpdateRequest updateRequest, @AuthenticationPrincipal AccountPrincipal principal) {
        ContentBlockResponse response = courseService.updateContentBlock(blockId, updateRequest, principal);
        return ResponseEntity.ok(response);
    }

//    @GetMapping("/api/courses/{courseId}/lessons")
//    public ResponseEntity<List<LessonMetadataResponse>> getLessonsByCourseId(@PathVariable Long courseId){
//        List<LessonMetadataResponse> lessons = courseService.getLessonsMetadataById(courseId);
//        return ResponseEntity.ok(lessons);
//    }
//
//    @PostMapping("/api/courses/{courseId}/lessons")
//    public ResponseEntity<LessonMetadataResponse> saveLesson(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long courseId, @RequestBody LessonCreateRequest lessonCreateRequest){
//        return ResponseEntity.ok(courseService.saveLesson(principal, courseId, lessonCreateRequest));
//    }
//
//    @DeleteMapping("/api/lessons/{id}")
//    public ResponseEntity<Void> deleteLesson(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long id){
//        courseService.deleteLesson(principal, id);
//        return ResponseEntity.noContent().build();
//    }
}
