package com.shinefiling.common.controller;

import com.shinefiling.common.model.StoredFile;
import com.shinefiling.common.repository.StoredFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {

    private final Path fileStorageLocation;

    @Autowired
    private StoredFileRepository storedFileRepository;

    public FileUploadController() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", defaultValue = "others") String category) {
        try {
            // Normalize category (prevent directory traversal)
            category = category.replaceAll("[^a-zA-Z0-9_-]", "");
            if (category.isEmpty())
                category = "others";

            // Normalize file name
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID().toString() + fileExtension;

            // Resolve directory
            Path targetDir = this.fileStorageLocation.resolve(category);
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            // Copy file to the target location
            Path targetLocation = targetDir.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Construct relative URL for FileController to serve
            String fileUrl = "/api/uploads/" + category + "/" + fileName;

            // Save to Database
            StoredFile storedFile = new StoredFile();
            storedFile.setFileName(fileName);
            storedFile.setOriginalFileName(originalFileName);
            storedFile.setContentType(file.getContentType());
            storedFile.setSize(file.getSize());
            storedFile.setUrl(fileUrl);
            storedFile.setFilePath(targetLocation.toString());
            storedFile.setCategory(category);
            storedFileRepository.save(storedFile);

            Map<String, Object> response = new HashMap<>();
            response.put("id", storedFile.getId());
            response.put("fileName", fileName);
            response.put("fileUrl", fileUrl);
            response.put("originalName", originalFileName);
            response.put("category", category);

            return ResponseEntity.ok(response);
        } catch (IOException ex) {
            return ResponseEntity.badRequest()
                    .body("Could not store file " + file.getOriginalFilename() + ". Please try again!");
        }
    }

    // Get all stored files (for admin management)
    @GetMapping("/all")
    public ResponseEntity<List<StoredFile>> getAllFiles() {
        return ResponseEntity.ok(storedFileRepository.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id) {
        return storedFileRepository.findById(id).map(storedFile -> {
            try {
                Path filePath = Paths.get(storedFile.getFilePath());
                Files.deleteIfExists(filePath);
                storedFileRepository.delete(storedFile);
                return ResponseEntity.ok().build();
            } catch (IOException e) {
                return ResponseEntity.internalServerError().body("Could not delete file from disk");
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    // Serve files
    @GetMapping("/generated/{fileName:.+}")
    public ResponseEntity<org.springframework.core.io.Resource> downloadGeneratedFile(@PathVariable String fileName,
            jakarta.servlet.http.HttpServletRequest request) {
        try {
            Path filePath = this.fileStorageLocation.resolve("generated").resolve(fileName).normalize();
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(
                    filePath.toUri());

            if (resource.exists()) {
                String contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
                if (contentType == null)
                    contentType = "text/html"; // Default for generated docs

                return ResponseEntity.ok()
                        .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{fileName:.+}")
    public ResponseEntity<org.springframework.core.io.Resource> downloadFile(@PathVariable String fileName,
            jakarta.servlet.http.HttpServletRequest request) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(
                    filePath.toUri());

            if (resource.exists()) {
                String contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
