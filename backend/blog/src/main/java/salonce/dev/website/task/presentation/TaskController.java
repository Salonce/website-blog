package salonce.dev.website.task.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import salonce.dev.website.task.application.TaskService;
import salonce.dev.website.task.domain.Task;
import salonce.dev.website.account.infrastructure.security.AccountPrincipal;
import salonce.dev.website.task.presentation.dtos.PostTaskRequest;
import salonce.dev.website.task.presentation.dtos.PutTaskRequest;

import java.net.URI;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getTasks(@AuthenticationPrincipal AccountPrincipal principal){
        return ResponseEntity.ok(taskService.getTasks(principal.id()));
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<Task> getTask(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long taskId){
        return ResponseEntity.ok(taskService.getTask(taskId, principal.id()));
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<Task> updateTask(@AuthenticationPrincipal AccountPrincipal principal, @RequestBody PutTaskRequest putTaskRequest, @PathVariable Long taskId){
        return ResponseEntity.ok(taskService.updateTask(taskId, putTaskRequest, principal.id()));
    }

    @PostMapping("/tasks")
    public ResponseEntity<Task> saveTask(@AuthenticationPrincipal AccountPrincipal principal, @RequestBody PostTaskRequest postTaskRequest){
        Task savedTask = taskService.saveTask(postTaskRequest, principal.id());
        return ResponseEntity
                .created(URI.create("/tasks/" + savedTask.getId()))
                .body(savedTask);
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@AuthenticationPrincipal AccountPrincipal principal, @PathVariable Long taskId){
        taskService.deleteTask(taskId, principal.id());
        return ResponseEntity.noContent().build();
    }
}
