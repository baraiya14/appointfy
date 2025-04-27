package com.healthbooking.controller;

import com.healthbooking.model.Doctor;
import com.healthbooking.repository.DoctorRepository;
import com.healthbooking.security.JwtUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/api")
public class DoctorController {
	
    private final DoctorRepository doctorRepository;
    private final JwtUtil jwtUtil;

    public DoctorController(DoctorRepository doctorRepository, JwtUtil jwtUtil) {
        this.doctorRepository = doctorRepository;
        this.jwtUtil = jwtUtil;
    }
    
    // Public endpoint to get all doctors for booking appointments
    @GetMapping("/doctors")
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }
    
    // Public endpoint to get a specific doctor by ID
    @GetMapping("/doctors/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        Optional<Doctor> doctor = doctorRepository.findById(id);
        return doctor.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/doctor/profile")
    public ResponseEntity<Doctor> getDoctorProfile(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        // Extract token value (remove "Bearer " prefix)
        String jwt = token.substring(7);
        
        // Extract ID from token
        Long doctorId = jwtUtil.extractId(jwt);
        
        Optional<Doctor> doctor = doctorRepository.findById(doctorId);
        return doctor.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PutMapping("/doctor/update")
    public ResponseEntity<Doctor> updateDoctorProfile(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token, 
            @RequestBody Doctor updatedDoctor) {
        // Extract token value
        String jwt = token.substring(7);
        
        // Extract ID from token
        Long doctorId = jwtUtil.extractId(jwt);
        
        return doctorRepository.findById(doctorId)
                .map(doctor -> {
                    if (updatedDoctor.getFullName() != null) {
                        doctor.setFullName(updatedDoctor.getFullName());
                    }
                    if (updatedDoctor.getSpecialization() != null) {
                        doctor.setSpecialization(updatedDoctor.getSpecialization());
                    }
                    if (updatedDoctor.getPhone() != null) {
                        doctor.setPhone(updatedDoctor.getPhone());
                    }
                    if (updatedDoctor.getEmail() != null) {
                        doctor.setEmail(updatedDoctor.getEmail());
                    }
                    // Update date of birth if provided
                    if (updatedDoctor.getDateOfBirth() != null) {
                        doctor.setDateOfBirth(updatedDoctor.getDateOfBirth());
                    }
                    return ResponseEntity.ok(doctorRepository.save(doctor));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PutMapping("/doctor/availability")
    public ResponseEntity<Doctor> updateAvailability(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestBody Map<String, Boolean> availabilityMap) {
        
        // Extract token value
        String jwt = token.substring(7);
        
        // Extract ID from token
        Long doctorId = jwtUtil.extractId(jwt);
        
        Boolean isAvailable = availabilityMap.get("available");
        if (isAvailable == null) {
            return ResponseEntity.badRequest().build();
        }
        
        return doctorRepository.findById(doctorId)
                .map(doctor -> {
                    doctor.setAvailable(isAvailable);
                    return ResponseEntity.ok(doctorRepository.save(doctor));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // Admin endpoint to update any doctor
    @PutMapping("/admin/doctors/{id}")
    public ResponseEntity<Doctor> adminUpdateDoctor(
            @PathVariable Long id,
            @RequestBody Doctor updatedDoctor) {
        
        return doctorRepository.findById(id)
                .map(doctor -> {
                    if (updatedDoctor.getFullName() != null) {
                        doctor.setFullName(updatedDoctor.getFullName());
                    }
                    if (updatedDoctor.getSpecialization() != null) {
                        doctor.setSpecialization(updatedDoctor.getSpecialization());
                    }
                    if (updatedDoctor.getPhone() != null) {
                        doctor.setPhone(updatedDoctor.getPhone());
                    }
                    if (updatedDoctor.getEmail() != null) {
                        doctor.setEmail(updatedDoctor.getEmail());
                    }
                    if (updatedDoctor.isAvailable() != doctor.isAvailable()) {
                        doctor.setAvailable(updatedDoctor.isAvailable());
                    }
                    // Update date of birth if provided
                    if (updatedDoctor.getDateOfBirth() != null) {
                        doctor.setDateOfBirth(updatedDoctor.getDateOfBirth());
                    }
                    return ResponseEntity.ok(doctorRepository.save(doctor));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
