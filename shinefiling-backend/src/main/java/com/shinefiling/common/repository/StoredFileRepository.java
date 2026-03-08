package com.shinefiling.common.repository;

import com.shinefiling.common.model.StoredFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoredFileRepository extends JpaRepository<StoredFile, Long> {
    Optional<StoredFile> findByFileName(String fileName);
}
