package salonce.dev.website.course.presentation.mappers;

import salonce.dev.website.course.domain.ContentBlock;
import salonce.dev.website.course.domain.TextBlock;
import salonce.dev.website.course.presentation.dtos.ContentBlockCreateRequest;
import salonce.dev.website.course.presentation.dtos.ContentBlockResponse;
import salonce.dev.website.course.presentation.dtos.ContentBlockUpdateRequest;

import java.util.HashMap;
import java.util.Map;

public class ContentBlockMapper {
    public static ContentBlockResponse toContentBlockResponse(ContentBlock block) {
        Map<String, Object> data = new HashMap<>();

        if (block instanceof TextBlock textBlock) {
            data.put("content", textBlock.getContent());
        }
//        else if (block instanceof ImageBlock imageBlock) {
//            data.put("imageUrl", imageBlock.getImageUrl());
//            data.put("caption", imageBlock.getCaption());
//        }

        return new ContentBlockResponse(
                block.getId(),
                block.type(),
                block.getPosition(),
                data
        );
    }

    public static ContentBlock createBlockFromRequest(ContentBlockCreateRequest request) {
        return switch (request.type().toUpperCase()) {
            case "TEXT" -> {
                String content = (String) request.data().get("content");
                if (content == null || content.isBlank()) {
                    throw new IllegalArgumentException("Content is required for TEXT block");
                }
                yield new TextBlock(content);
            }

//            case "IMAGE" -> {
//                String imageUrl = (String) request.data().get("imageUrl");
//                String caption = (String) request.data().get("caption");
//                if (imageUrl == null || imageUrl.isBlank()) {
//                    throw new IllegalArgumentException("imageUrl is required for IMAGE block");
//                }
//                yield new ImageBlock(imageUrl, caption, request.position());
//            }

//            case "QUIZ" -> {
//                try {
//                    // Convert data Map to JSON string for storage
//                    String quizJson = objectMapper.writeValueAsString(request.data());
//                    yield new QuizBlock(quizJson, request.position());
//                } catch (JsonProcessingException e) {
//                    throw new IllegalArgumentException("Invalid quiz data format", e);
//                }
//            }

            default -> throw new IllegalArgumentException("Unknown block type: " + request.type());
        };
    }

    public static void updateBlockFromRequest(ContentBlock block, ContentBlockUpdateRequest request) {
        String type = request.type();
        Map<String, Object> data = request.data();

        // Validate type matches
        if (!block.type().equals(type)) {
            throw new IllegalArgumentException(
                    "Cannot change block type from " + block.type() + " to " + type
            );
        }

        switch (type) {
            case "TEXT" -> {
                if (!(block instanceof TextBlock textBlock)) {
                    throw new IllegalArgumentException("Block is not a TextBlock");
                }
                String content = (String) data.get("content");
                if (content == null || content.isBlank()) {
                    throw new IllegalArgumentException("Content is required for TEXT block");
                }
                textBlock.setContent(content);
            }
            // Future block types:
            // case "IMAGE" -> {
            //     ImageBlock imageBlock = (ImageBlock) block;
            //     imageBlock.setUrl((String) data.get("url"));
            //     imageBlock.setAlt((String) data.get("alt"));
            // }
            default -> throw new IllegalArgumentException("Unknown block type: " + type);
        }
    }
}
