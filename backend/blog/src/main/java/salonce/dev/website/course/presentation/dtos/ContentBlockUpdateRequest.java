package salonce.dev.website.course.presentation.dtos;

import java.util.Map;

public record ContentBlockUpdateRequest(String type, Map<String, Object> data){}
