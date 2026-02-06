package salonce.dev.website.task.infrastructure;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import salonce.dev.website.task.domain.Task;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository <Task, Long> {
    List<Task> findByAccountId(Long accountId);
    Optional<Task> findByIdAndAccountId(Long id, Long accountId);
    void deleteByIdAndAccountId(Long id, Long accountId);
    boolean existsByIdAndAccountId(Long id, Long accountId);
}
