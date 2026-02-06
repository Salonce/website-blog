package salonce.dev.todolist.course.presentation.dtos;

import java.util.Map;

public record ContentBlockResponse(
        Long id,
        String type,
        Integer position,
        Map<String, Object> data
) {}