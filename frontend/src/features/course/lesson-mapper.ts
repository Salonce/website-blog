import { LessonResponse } from './dtos/lesson-response';
import { ContentBlockResponse } from './dtos/content-block-response';
import { Lesson } from './models/lesson';
import { ContentBlock, TextBlock } from './models/content-block';

export class LessonMapper {
  
  static fromDto(dto: LessonResponse): Lesson {
    return {
      id: dto.id,
      title: dto.title,
      slug: dto.slug,
      orderId: dto.orderId,
      contentBlocks: dto.contentBlocks.map(block => 
        this.mapContentBlock(block)
      )
    };
  }

  static fromDtoArray(dtos: LessonResponse[]): Lesson[] {
    return dtos.map(dto => this.fromDto(dto));
  }
  
  private static mapContentBlock(dto: ContentBlockResponse): ContentBlock {
    const baseBlock = {
      id: dto.id,
      position: dto.position,
      type: dto.type
    };
    
    switch (dto.type) {
      case 'TEXT':
        return {
          ...baseBlock,
          type: 'TEXT',
          content: dto.data['text'] || dto.data['content'] || ''
        } as TextBlock;
      
      // Add other content block types as needed
      
      default:
        return baseBlock as ContentBlock;
    }
  }
}