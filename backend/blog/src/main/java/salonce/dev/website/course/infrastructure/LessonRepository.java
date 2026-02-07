package salonce.dev.website.course.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import salonce.dev.website.course.domain.Lesson;
import salonce.dev.website.course.presentation.dtos.LessonMetadataResponse;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    @Query("SELECT COALESCE(MAX(l.position), 0) FROM Lesson l WHERE l.course.id = :courseId")
    int findMaxOrderIndex(@Param("courseId") Long courseId);

    @Query("""
        SELECT new salonce.dev.website.course.presentation.dtos.LessonMetadataResponse(
                l.id,
                l.title,
                l.slug,
                l.position
            )
            FROM Lesson l
            WHERE l.course.slug = :courseSlug
            ORDER BY l.position ASC
        """)
    List<LessonMetadataResponse> findAllMetadataByCourseSlug(@Param("courseSlug") String courseSlug);

    @Query("""
        SELECT new salonce.dev.website.course.presentation.dtos.LessonMetadataResponse(
                l.id,
                l.title,
                l.slug,
                l.position
            )
            FROM Lesson l
            WHERE l.course.id = :id
            ORDER BY l.position ASC
        """)
    List<LessonMetadataResponse> findAllMetadataByCourseId(@Param("id") Long id);

    @Query("SELECT l FROM Lesson l JOIN l.course c WHERE c.slug = :courseSlug AND l.slug = :lessonSlug")
    Optional<Lesson> findByCourseSlugAndLessonSlug(
            @Param("courseSlug") String courseSlug,
            @Param("lessonSlug") String lessonSlug
    );

    @Modifying
    @Query("""
        UPDATE Lesson l
        SET l.position = l.position - 1
        WHERE l.course.id = :courseId
          AND l.position > :deletedPosition
    """)
    void shiftPositionsAfterDeletion(
            @Param("courseId") Long courseId,
            @Param("deletedPosition") int deletedPosition
    );
}
