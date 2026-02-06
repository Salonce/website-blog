package salonce.dev.todolist.course.presentation.dtos;

import java.util.Map;

public record ContentBlockUpdateRequest(String type, Map<String, Object> data){}
