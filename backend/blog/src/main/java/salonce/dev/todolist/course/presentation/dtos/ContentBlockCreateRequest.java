package salonce.dev.todolist.course.presentation.dtos;

import java.util.Map;

public record ContentBlockCreateRequest(
        String type,  // "TEXT", "IMAGE", "QUIZ"
        Map<String, Object> data
) {}
