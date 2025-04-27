package com.healthbooking.controller;

import com.healthbooking.model.Doctor;
import com.healthbooking.model.Patient;
import com.healthbooking.model.Admin;
import com.healthbooking.repository.DoctorRepository;
import com.healthbooking.repository.PatientRepository;
import com.healthbooking.repository.AdminRepository;
import com.healthbooking.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AdminController {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private JwtUtil jwtUtil;

    public AdminController(DoctorRepository doctorRepository, PatientRepository patientRepository) {
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    @GetMapping("/admin/patients")
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
    
    // Admin endpoint to get own profile
    @GetMapping("/admin/profile")
    public ResponseEntity<?> getAdminProfile(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        try {
            // Extract token value (remove "Bearer " prefix)
            String jwt = token.substring(7);
            
            // Extract ID from token
            Long adminId = jwtUtil.extractId(jwt);
            
            Optional<Admin> admin = adminRepository.findById(adminId);
            if (admin.isPresent()) {
                return ResponseEntity.ok(admin.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Admin not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error fetching admin profile: " + e.getMessage()));
        }
    }
    
    // Admin endpoint to update own profile
    @PutMapping("/admin/profile")
    public ResponseEntity<?> updateAdminProfile(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestBody Map<String, Object> updates) {
        try {
            // Extract token value
            String jwt = token.substring(7);
            
            // Extract ID from token
            Long adminId = jwtUtil.extractId(jwt);
            
            Optional<Admin> adminOpt = adminRepository.findById(adminId);
            if (adminOpt.isPresent()) {
                Admin admin = adminOpt.get();
                
                // Update fields
                if (updates.containsKey("fullName")) {
                    admin.setFullName((String) updates.get("fullName"));
                }
                if (updates.containsKey("email")) {
                    admin.setEmail((String) updates.get("email"));
                }
                if (updates.containsKey("phone")) {
                    admin.setPhone((String) updates.get("phone"));
                }
                // Update date of birth if provided - this would need conversion from string to LocalDate
                // if (updates.containsKey("dateOfBirth")) {
                //    admin.setDateOfBirth(LocalDate.parse((String) updates.get("dateOfBirth")));
                // }
                
                Admin savedAdmin = adminRepository.save(admin);
                return ResponseEntity.ok(savedAdmin);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Admin not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error updating admin profile: " + e.getMessage()));
        }
    }
}
