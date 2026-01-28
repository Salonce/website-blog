package salonce.dev.todolist.course.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import salonce.dev.todolist.course.domain.Lesson;
import salonce.dev.todolist.course.presentation.dtos.LessonMetadataViewResponse;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    @Query("SELECT COALESCE(MAX(l.orderId), 0) FROM Lesson l WHERE l.course.id = :courseId")
    int findMaxOrderIndex(@Param("courseId") Long courseId);

    @Query("""
        SELECT new salonce.dev.todolist.course.presentation.dtos.LessonMetadataViewResponse(
                l.id,
                l.title,
                l.slug,
                l.orderId
            )
            FROM Lesson l
            WHERE l.course.slug = :courseSlug
            ORDER BY l.orderId ASC
        """)
    List<LessonMetadataViewResponse> findAllMetadataByCourseSlug(@Param("courseSlug") String courseSlug);
}
