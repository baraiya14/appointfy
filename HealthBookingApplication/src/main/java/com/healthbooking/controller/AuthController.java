package com.healthbooking.controller;

import com.healthbooking.model.Doctor;
import com.healthbooking.model.Patient;
import com.healthbooking.model.User;
import com.healthbooking.model.Admin;
import com.healthbooking.repository.DoctorRepository;
import com.healthbooking.repository.PatientRepository;
import com.healthbooking.repository.UserRepository;
import com.healthbooking.repository.AdminRepository;
import com.healthbooking.security.CustomUserDetailsService;
import com.healthbooking.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Autowired
    private UserRepository userRepository;
    
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthController(DoctorRepository doctorRepository, PatientRepository patientRepository, AdminRepository adminRepository, 
                          PasswordEncoder passwordEncoder, JwtUtil jwtUtil, 
                          AuthenticationManager authenticationManager, CustomUserDetailsService userDetailsService) {
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/register/doctor")
    public ResponseEntity<?> registerDoctor(@RequestBody Doctor doctor) {
        try {
            // Check if email already exists
            if (userRepository.findByEmail(doctor.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email already in use"));
            }
            
            // Validate required fields
            if (doctor.getEmail() == null || doctor.getPassword() == null || doctor.getFullName() == null || doctor.getSpecialization() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Required fields missing"));
            }
            
            doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
            doctor.setRole("ROLE_DOCTOR");
            doctor.setAvailable(true); // Default to available
            
            Doctor savedDoctor = doctorRepository.save(doctor);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Doctor registered successfully");
            response.put("id", savedDoctor.getId());
            response.put("email", savedDoctor.getEmail());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/register/patient")
    public ResponseEntity<?> registerPatient(@RequestBody Patient patient) {
        try {
            // Check if email already exists
            if (userRepository.findByEmail(patient.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email already in use"));
            }
            
            // Validate required fields
            if (patient.getEmail() == null || patient.getPassword() == null || patient.getPatientName() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Required fields missing"));
            }
            
            patient.setPassword(passwordEncoder.encode(patient.getPassword()));
            patient.setRole("ROLE_PATIENT");
            
            Patient savedPatient = patientRepository.save(patient);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Patient registered successfully");
            response.put("id", savedPatient.getId());
            response.put("email", savedPatient.getEmail());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin admin) {
        try {
            // Check if email already exists
            if (userRepository.findByEmail(admin.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email already in use"));
            }
            
            // Validate required fields
            if (admin.getEmail() == null || admin.getPassword() == null || admin.getFullName() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Required fields missing"));
            }
            
            admin.setPassword(passwordEncoder.encode(admin.getPassword()));
            admin.setRole("ROLE_ADMIN");
            
            Admin savedAdmin = adminRepository.save(admin);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Admin registered successfully");
            response.put("id", savedAdmin.getId());
            response.put("email", savedAdmin.getEmail());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody(required = false) Map<String, String> request) {
        if (request == null || !request.containsKey("email") || !request.containsKey("password")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid request. Email and password are required."));
        }

        String email = request.get("email");
        String password = request.get("password");

        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            // Load user details
            UserDetails userDetails = userDetailsService.loadUserByEmail(email);
            Optional<User> user = userRepository.findByEmail(email);
            
            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not found"));
            }

            // Get user ID and role
            Long userId = user.get().getId();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            
            // Generate JWT token
            String token = jwtUtil.generateToken(userDetails, userId);
            
            // Create response with user info
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", role);
            response.put("userId", userId);
            
            // Add user type-specific info
            if (role.equals("ROLE_DOCTOR")) {
                Optional<Doctor> doctor = doctorRepository.findById(userId);
                if (doctor.isPresent()) {
                    response.put("name", doctor.get().getFullName());
                    response.put("email", doctor.get().getEmail());
                    response.put("specialization", doctor.get().getSpecialization());
                }
            } else if (role.equals("ROLE_PATIENT")) {
                Optional<Patient> patient = patientRepository.findById(userId);
                if (patient.isPresent()) {
                    response.put("name", patient.get().getPatientName());
                    response.put("email", patient.get().getEmail());
                }
            } else if (role.equals("ROLE_ADMIN")) {
                Optional<Admin> admin = adminRepository.findById(userId);
                if (admin.isPresent()) {
                    response.put("name", admin.get().getFullName());
                    response.put("email", admin.get().getEmail());
                }
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid email or password"));
        }
    }
}