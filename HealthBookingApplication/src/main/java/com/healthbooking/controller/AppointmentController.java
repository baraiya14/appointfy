package com.healthbooking.controller;

import com.healthbooking.model.Appointment;
import com.healthbooking.model.Doctor;
import com.healthbooking.model.Patient;
import com.healthbooking.repository.AppointmentRepository;
import com.healthbooking.repository.DoctorRepository;
import com.healthbooking.repository.PatientRepository;
import com.healthbooking.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping
    public ResponseEntity<?> bookAppointment(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> requestBody
    ) {
        try {
            // Validate Token
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
            }

            // Extract Patient ID from JWT
            String jwt = token.substring(7);
            Long patientId = jwtUtil.extractId(jwt);

            // Extract fields from request body
            Long doctorId = ((Number) requestBody.get("doctorId")).longValue();
            String appointmentDateStr = (String) requestBody.get("appointmentDate");
            String time = (String) requestBody.get("appointmentTime");
            String reasonForVisit = (String) requestBody.get("reasonForVisit");

            if (doctorId == null || appointmentDateStr == null || time == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
            }

            // Parse Date
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate appointmentDate = LocalDate.parse(appointmentDateStr, dateFormatter);

            Optional<Patient> patientOpt = patientRepository.findById(patientId);
            Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);

            if (patientOpt.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "Patient not found!"));
            if (doctorOpt.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "Doctor not found!"));

            if (!doctorOpt.get().isAvailable()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Doctor is not available!"));
            }

            // Check for conflicting appointments
            List<Appointment> existingAppointments = appointmentRepository.findByDoctorAndAppointmentDateAndAppointmentTime(
                    doctorOpt.get(), appointmentDate, time);
            
            if (!existingAppointments.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "This time slot is already booked"));
            }

            Appointment appointment = new Appointment(patientOpt.get(), doctorOpt.get(), appointmentDate, time, "SCHEDULED");
            if (reasonForVisit != null) {
                appointment.setReasonForVisit(reasonForVisit);
            }
            appointmentRepository.save(appointment);

            return ResponseEntity.ok(Map.of(
                "message", "Appointment booked successfully!",
                "appointment", appointment
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error booking appointment: " + e.getMessage()));
        }
    }

    @GetMapping("/patient")
    public ResponseEntity<?> getMyAppointments(@RequestHeader("Authorization") String token) {
        try {
            // Validate Token
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
            }

            // Extract Patient ID from JWT
            String jwt = token.substring(7);
            Long patientId = jwtUtil.extractId(jwt);
            
            Optional<Patient> patientOpt = patientRepository.findById(patientId);
            
            if (patientOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Patient not found!"));
            }

            // Fetch patient's appointments
            List<Appointment> appointments = appointmentRepository.findByPatientOrderByAppointmentDateDesc(patientOpt.get());
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error fetching appointments: " + e.getMessage()));
        }
    }
    
    @GetMapping("/doctor")
    public ResponseEntity<?> getDoctorAppointments(@RequestHeader("Authorization") String token) {
        try {
            // Validate Token
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
            }

            // Extract Doctor ID from JWT
            String jwt = token.substring(7);
            Long doctorId = jwtUtil.extractId(jwt);
            
            Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
            
            if (doctorOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Doctor not found!"));
            }

            // Fetch doctor's appointments
            List<Appointment> appointments = appointmentRepository.findByDoctorOrderByAppointmentDateDesc(doctorOpt.get());
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error fetching appointments: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> statusUpdate) {
        
        try {
            // Validate Token
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
            }
            
            String status = statusUpdate.get("status");
            if (status == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
            }
            
            // Validate status
            if (!status.equals("SCHEDULED") && !status.equals("COMPLETED") && 
                !status.equals("CANCELLED") && !status.equals("NO_SHOW")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid status value"));
            }

            Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
            if (appointmentOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Appointment appointment = appointmentOpt.get();
            appointment.setStatus(status);
            appointmentRepository.save(appointment);
            
            return ResponseEntity.ok(Map.of("message", "Appointment status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error updating appointment status: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllAppointments() {
        try {
            List<Appointment> appointments = appointmentRepository.findAll();
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error fetching all appointments: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Long id) {
        try {
            Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
            if (appointmentOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(appointmentOpt.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error fetching appointment: " + e.getMessage()));
        }
    }
}


//✅ Book an Appointment
//@PostMapping("/book")
//public ResponseEntity<?> bookAppointment(
//      @RequestParam Long patientId,
//      @RequestParam Long doctorId,
//      @RequestParam String appointmentDate,  
//      @RequestParam String time  
//) {
//  try {
//      DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//      LocalDate parsedDate = LocalDate.parse(appointmentDate, dateFormatter);
//
//      Optional<Patient> patientOpt = patientRepository.findById(patientId);
//      Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
//
//      if (patientOpt.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "Patient not found!"));
//      if (doctorOpt.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "Doctor not found!"));
//
//      Doctor doctor = doctorOpt.get();
//      if (!doctor.isAvailable()) {
//          return ResponseEntity.badRequest().body(Map.of("error", "Doctor is not available!"));
//      }
//
//      Appointment appointment = new Appointment(
//              patientOpt.get(), 
//              doctor, 
//              parsedDate, 
//              time, 
//              "PENDING"
//      );
//      appointmentRepository.save(appointment);
//      return ResponseEntity.ok(Map.of("message", "Appointment booked successfully!"));
//  } catch (Exception e) {
//      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error booking appointment"));
//  }
//}

//
//@PostMapping("/book")
//public ResponseEntity<?> bookAppointment(
//        @RequestHeader("Authorization") String token,  // Extract JWT token from header
//        @RequestParam Long doctorId,
//        @RequestParam String appointmentDate,
//        @RequestParam String time
//) {
//    try {
//        // 🔹 1. Validate Token
//        if (token == null || !token.startsWith("Bearer ")) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
//        }
//
//        // 🔹 2. Extract Patient ID from JWT
//        String jwt = token.substring(7); // Remove "Bearer " prefix
//        Long patientId = jwtUtil.extractId(jwt); // Extract ID from JWT
//
//        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//        LocalDate parsedDate = LocalDate.parse(appointmentDate, dateFormatter);
//
//        Optional<Patient> patientOpt = patientRepository.findById(patientId);
//        Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
//
//        if (patientOpt.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "Patient not found!"));
//        if (doctorOpt.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "Doctor not found!"));
//
//        if (!doctorOpt.get().isAvailable()) {
//            return ResponseEntity.badRequest().body(Map.of("error", "Doctor is not available!"));
//        }
//
//        Appointment appointment = new Appointment(patientOpt.get(), doctorOpt.get(), parsedDate, time, "PENDING");
//        appointmentRepository.save(appointment);
//
//        return ResponseEntity.ok(Map.of("message", "Appointment booked successfully!"));
//    } catch (Exception e) {
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error booking appointment"));
//    }
//}
