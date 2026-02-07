package salonce.dev.website.course.infrastructure;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import salonce.dev.website.course.domain.Course;
import salonce.dev.website.course.presentation.dtos.CourseMetadataResponse;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findBySlug(String slug);
    Optional<Course> findTopByOrderByPositionDesc();

    @Query("SELECT c FROM Course c")
    @EntityGraph(attributePaths = {"lessons"})
    List<Course> findAllWithLessons();

    @Query("""
    select new salonce.dev.website.course.presentation.dtos.CourseMetadataResponse(
        c.id,
        c.name,
        c.slug,
        c.position,
        count(l)
    )
    from Course c
    left join c.lessons.lessons l
    group by c.id, c.name, c.slug, c.position
    order by c.position asc
    """)
    List<CourseMetadataResponse> findAllCourseViewsOrderByPosition();


    List<Course> findAllByOrderByPositionAsc();

    List<Course> findByPublishedTrueOrderByPositionAsc();


    @Query("SELECT COALESCE(MAX(c.position), 0) FROM Course c")
    Integer findMaxPosition();

    Optional<Course> findByPosition(Integer position);

    @Modifying
    @Query("UPDATE Course c SET c.position = c.position + 1 WHERE c.position >= :position")
    void incrementPositionsFrom(@Param("position") Integer position);

    @Modifying
    @Query("UPDATE Course c SET c.position = c.position - 1 WHERE c.position > :position")
    void decrementPositionsFrom(@Param("position") Integer position);

    @Modifying
    @Query("""
        UPDATE Course c
        SET c.position = c.position - 1
        WHERE c.position > :deletedPosition
    """)
    void shiftPositionsAfterDeletion(
            @Param("deletedPosition") int deletedPosition
    );
}
