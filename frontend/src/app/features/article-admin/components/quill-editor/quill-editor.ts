import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-quill-editor',
  imports: [QuillModule, FormsModule],
  templateUrl: './quill-editor.html',
  styleUrl: './quill-editor.css'
})
export class QuillEditor {

  @Input() content: string = '';
  @Output() contentChange = new EventEmitter<string>();

  onContentChange(value: string) {
    this.content = value;
    this.contentChange.emit(value);
  }

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['link', 'image'],
      ['clean']
    ],
    imageResize: {
      modules: ['Resize', 'DisplaySize']
    }
  };
}
