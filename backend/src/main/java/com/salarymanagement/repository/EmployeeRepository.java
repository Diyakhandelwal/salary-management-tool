package com.salarymanagement.repository;

import com.salarymanagement.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmployeeCode(String employeeCode);

    Optional<Employee> findByEmail(String email);

    boolean existsByEmployeeCode(String employeeCode);

    boolean existsByEmail(String email);

    @Query("SELECT e FROM Employee e WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           " LOWER(e.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(e.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(e.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(e.jobTitle) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:department IS NULL OR :department = '' OR LOWER(e.department) = LOWER(:department)) AND " +
           "(:country IS NULL OR :country = '' OR LOWER(e.country) = LOWER(:country)) AND " +
           "(:status IS NULL OR :status = '' OR e.status = :status) AND " +
           "(:minSalary IS NULL OR e.baseSalary >= :minSalary) AND " +
           "(:maxSalary IS NULL OR e.baseSalary <= :maxSalary)")
    Page<Employee> searchEmployees(
            @Param("keyword") String keyword,
            @Param("department") String department,
            @Param("country") String country,
            @Param("status") String status,
            @Param("minSalary") BigDecimal minSalary,
            @Param("maxSalary") BigDecimal maxSalary,
            Pageable pageable);

    @Query("SELECT DISTINCT e.department FROM Employee e ORDER BY e.department ASC")
    List<String> findDistinctDepartments();

    @Query("SELECT DISTINCT e.country FROM Employee e ORDER BY e.country ASC")
    List<String> findDistinctCountries();

    @Query("SELECT e.department, COUNT(e), SUM(e.baseSalary), AVG(e.baseSalary), MIN(e.baseSalary), MAX(e.baseSalary) " +
           "FROM Employee e GROUP BY e.department")
    List<Object[]> getDepartmentStats();

    @Query("SELECT e.country, COUNT(e), SUM(e.baseSalary), AVG(e.baseSalary), MIN(e.baseSalary), MAX(e.baseSalary) " +
           "FROM Employee e GROUP BY e.country")
    List<Object[]> getCountryStats();

    @Query("SELECT e.jobTitle, COUNT(e), AVG(e.baseSalary), MIN(e.baseSalary), MAX(e.baseSalary) " +
           "FROM Employee e GROUP BY e.jobTitle ORDER BY COUNT(e) DESC")
    List<Object[]> getRoleStats();

    @Query("SELECT e FROM Employee e WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           " LOWER(e.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(e.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(e.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(e.jobTitle) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:department IS NULL OR :department = '' OR LOWER(e.department) = LOWER(:department)) AND " +
           "(:country IS NULL OR :country = '' OR LOWER(e.country) = LOWER(:country)) AND " +
           "(:status IS NULL OR :status = '' OR e.status = :status) AND " +
           "(:minSalary IS NULL OR e.baseSalary >= :minSalary) AND " +
           "(:maxSalary IS NULL OR e.baseSalary <= :maxSalary) " +
           "ORDER BY e.id DESC")
    List<Employee> filterEmployees(
            @Param("keyword") String keyword,
            @Param("department") String department,
            @Param("country") String country,
            @Param("status") String status,
            @Param("minSalary") BigDecimal minSalary,
            @Param("maxSalary") BigDecimal maxSalary);
}
