package salonce.dev.todolist.course.infrastructure;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import salonce.dev.todolist.course.domain.Course;
import salonce.dev.todolist.course.presentation.dtos.CourseMetadataResponse;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findBySlug(String slug);
    Optional<Course> findTopByOrderByOrderIdDesc();

    @Query("SELECT c FROM Course c")
    @EntityGraph(attributePaths = {"lessons"})
    List<Course> findAllWithLessons();

    @Query("""
    select new salonce.dev.todolist.course.presentation.dtos.CourseMetadataResponse(
        c.id,
        c.name,
        c.slug,
        c.orderId,
        count(l)
    )
    from Course c
    left join c.lessons.lessons l
    group by c.id, c.name, c.slug, c.orderId
    """)
    List<CourseMetadataResponse> findAllCourseViews();
}
