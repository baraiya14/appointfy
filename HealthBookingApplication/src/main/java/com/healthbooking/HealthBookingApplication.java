package com.healthbooking;

import java.time.LocalDate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.healthbooking.model.Appointment;
import com.healthbooking.model.Doctor;
import com.healthbooking.model.Patient;

@SpringBootApplication
@EnableJpaRepositories("com.healthbooking.repository")
@ComponentScan("com.healthbooking")
public class HealthBookingApplication {

	public static void main(String[] args) {
		SpringApplication.run(HealthBookingApplication.class, args);
		
//		
//		 Doctor doctor = new Doctor("dr_smith", "password123", "Dr. John Smith", "Cardiologist", "dr.smith@example.com", "9876543210");
//
//	        System.out.println("Username: " + doctor.getEmail());
//	        System.out.println("Full Name: " + doctor.getFullName());
//	        System.out.println("Specialization: " + doctor.getSpecialization());
//	        System.out.println("Email: " + doctor.getEmail());
//	        System.out.println("Phone: " + doctor.getPhone());
//	        System.out.println("Available: " + doctor.isAvailable());
//	      
//	        Patient patient = new Patient("john_doe", "password123", "John Doe", "john.doe@example.com");
//
//	        // Link appointments
//
//	        // Print details to verify
//	        System.out.println("Patient: " + patient.getPatientName());
//	        System.out.println("Doctor: " + doctor.getFullName());
//	        System.out.println("Appointments: ");
//	        for (Appointment appt : patient.getAppointments()) {
//	        System.out.println("  Date: " + appt.getAppointmentDate() + " | Time: " + appt.getAppointmentTime() + " | Status: " + appt.getStatus());
	        
	}
}
