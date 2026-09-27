package com.salarymanagement.repository;

import com.salarymanagement.model.SalaryRevision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalaryRevisionRepository extends JpaRepository<SalaryRevision, Long> {
    List<SalaryRevision> findByEmployeeIdOrderByEffectiveDateDesc(Long employeeId);
    List<SalaryRevision> findTop10ByOrderByCreatedAtDesc();
}
