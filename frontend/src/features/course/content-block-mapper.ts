import { ContentBlockResponse } from "./dtos/content-block-response";
import { ContentBlock, TextBlock } from "./models/content-block";

export class ContentBlockMapper {
  /**
   * Map ContentBlockResponse from backend to frontend ContentBlock model
   */
  static fromResponse(response: ContentBlockResponse): ContentBlock {
    switch (response.type) {
      case 'TEXT':
        return {
          id: response.id,
          position: response.position,
          type: response.type,
          content: response.data['content']
        } as TextBlock;
      
      // Add other block types here as needed
      // case 'IMAGE':
      //   return { ... } as ImageBlock;
      
      default:
        throw new Error(`Unknown block type: ${response.type}`);
    }
  }

  static fromResponseArray(responses: ContentBlockResponse[]): ContentBlock[] {
    return responses.map(r => this.fromResponse(r));
  }
}