package com.healthbooking.controller;

import com.healthbooking.model.Patient;
import com.healthbooking.repository.PatientRepository;
import com.healthbooking.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class PatientController {
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    // Admin and Doctor endpoint to get all patients
    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();
        return ResponseEntity.ok(patients);
    }
    
    // Admin and Doctor endpoint to get a specific patient
    @GetMapping("/patients/{id}")
    public ResponseEntity<?> getPatientById(@PathVariable Long id) {
        Optional<Patient> patient = patientRepository.findById(id);
        if (patient.isPresent()) {
            return ResponseEntity.ok(patient.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Patient not found"));
        }
    }
    
    // Patient endpoint to get own profile
    @GetMapping("/patient/profile")
    public ResponseEntity<?> getPatientProfile(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        try {
            // Extract token value (remove "Bearer " prefix)
            String jwt = token.substring(7);
            
            // Extract ID from token
            Long patientId = jwtUtil.extractId(jwt);
            
            Optional<Patient> patient = patientRepository.findById(patientId);
            if (patient.isPresent()) {
                return ResponseEntity.ok(patient.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Patient not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error fetching patient profile: " + e.getMessage()));
        }
    }
    
    // Patient endpoint to update own profile
    @PutMapping("/patient/profile")
    public ResponseEntity<?> updatePatientProfile(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestBody Patient updatedPatient) {
        try {
            // Extract token value
            String jwt = token.substring(7);
            
            // Extract ID from token
            Long patientId = jwtUtil.extractId(jwt);
            
            Optional<Patient> patientOpt = patientRepository.findById(patientId);
            if (patientOpt.isPresent()) {
                Patient patient = patientOpt.get();
                
                // Update fields
                if (updatedPatient.getPatientName() != null) {
                    patient.setPatientName(updatedPatient.getPatientName());
                }
                if (updatedPatient.getEmail() != null) {
                    patient.setEmail(updatedPatient.getEmail());
                }
                if (updatedPatient.getPhone() != null) {
                    patient.setPhone(updatedPatient.getPhone());
                }
                if (updatedPatient.getAddress() != null) {
                    patient.setAddress(updatedPatient.getAddress());
                }
                if (updatedPatient.getAge() != null) {
                    patient.setAge(updatedPatient.getAge());
                }
                if (updatedPatient.getGender() != null) {
                    patient.setGender(updatedPatient.getGender());
                }
                // Update date of birth if provided
                if (updatedPatient.getDateOfBirth() != null) {
                    patient.setDateOfBirth(updatedPatient.getDateOfBirth());
                }
                
                Patient savedPatient = patientRepository.save(patient);
                return ResponseEntity.ok(savedPatient);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Patient not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error updating patient profile: " + e.getMessage()));
        }
    }
    
    // Admin endpoint to update any patient
    @PutMapping("/admin/patients/{id}")
    public ResponseEntity<?> adminUpdatePatient(
            @PathVariable Long id,
            @RequestBody Patient updatedPatient) {
        try {
            Optional<Patient> patientOpt = patientRepository.findById(id);
            if (patientOpt.isPresent()) {
                Patient patient = patientOpt.get();
                
                // Update fields
                if (updatedPatient.getPatientName() != null) {
                    patient.setPatientName(updatedPatient.getPatientName());
                }
                if (updatedPatient.getEmail() != null) {
                    patient.setEmail(updatedPatient.getEmail());
                }
                if (updatedPatient.getPhone() != null) {
                    patient.setPhone(updatedPatient.getPhone());
                }
                if (updatedPatient.getAddress() != null) {
                    patient.setAddress(updatedPatient.getAddress());
                }
                if (updatedPatient.getAge() != null) {
                    patient.setAge(updatedPatient.getAge());
                }
                if (updatedPatient.getGender() != null) {
                    patient.setGender(updatedPatient.getGender());
                }
                // Update date of birth if provided
                if (updatedPatient.getDateOfBirth() != null) {
                    patient.setDateOfBirth(updatedPatient.getDateOfBirth());
                }
                
                Patient savedPatient = patientRepository.save(patient);
                return ResponseEntity.ok(savedPatient);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Patient not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error updating patient: " + e.getMessage()));
        }
    }
    
    // Admin endpoint to delete a patient
    @DeleteMapping("/admin/patients/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        try {
            if (!patientRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Patient not found"));
            }
            
            patientRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Patient deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error deleting patient: " + e.getMessage()));
        }
    }
}
