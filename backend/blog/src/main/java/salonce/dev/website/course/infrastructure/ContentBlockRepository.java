package salonce.dev.website.course.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import salonce.dev.website.course.domain.ContentBlock;

@Repository
public interface ContentBlockRepository extends JpaRepository<ContentBlock, Long> {

    @Query("""
        SELECT COALESCE(MAX(cb.position), 0)
        FROM ContentBlock cb
        WHERE cb.lesson.id = :lessonId
    """)
    int findMaxPositionByLessonId(@Param("lessonId") Long lessonId);
}
