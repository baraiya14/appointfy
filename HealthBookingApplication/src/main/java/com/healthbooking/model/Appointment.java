	package com.healthbooking.model;
	
	import jakarta.persistence.*;
	import lombok.Getter;
	import lombok.Setter;
	import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
	
	@Entity
	@Getter
	@Setter
	@Table(name = "appointments")
//	@DiscriminatorValue("APPOINTMENT")
	public class Appointment {
	
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	
	    @ManyToOne(fetch = FetchType.LAZY)
	    @JsonBackReference
	    @JoinColumn(name = "patient_id", nullable = false) // Many Appointments belong to one Patient
	    private Patient patient;
	
	    @ManyToOne(fetch = FetchType.EAGER)
	    @JoinColumn(name = "doctor_id", nullable = false) // Each Appointment is linked to a Doctor
	    private Doctor doctor;
	
	    @Column(nullable = false)
	    private LocalDate appointmentDate;
	
	    @Column(nullable = false)
	    private String appointmentTime; // e.g., "10:30 AM"
	
	    @Column(nullable = false)
	    private String status; // PENDING, CONFIRMED, COMPLETED
	
	    @Column(nullable = false)
	    private String reasonForVisit;
	
	    public Appointment() {}
	
	    public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public Doctor getDoctor() {
			return doctor;
		}

		public void setDoctor(Doctor doctor) {
			this.doctor = doctor;
		}

		public LocalDate getAppointmentDate() {
			return appointmentDate;
		}

		public void setAppointmentDate(LocalDate appointmentDate) {
			this.appointmentDate = appointmentDate;
		}

		public String getAppointmentTime() {
			return appointmentTime;
		}

		public void setAppointmentTime(String appointmentTime) {
			this.appointmentTime = appointmentTime;
		}

		public String getStatus() {
			return status;
		}

		public void setStatus(String status) {
			this.status = status;
		}

		public Patient getPatient() {
			return patient;
		}
	
		 
		public Appointment(Patient patient, Doctor doctor, LocalDate appointmentDate, String appointmentTime, String status) {
	        this.patient = patient;
	        this.doctor = doctor;
	        this.appointmentDate = appointmentDate;
	        this.appointmentTime = appointmentTime;
	        this.status = status;
	        this.reasonForVisit = "General checkup"; // Default value
	    }
	    public void setPatient(Patient patient) {
	        this.patient = patient;
	    }

		public String getReasonForVisit() {
			return reasonForVisit;
		}

		public void setReasonForVisit(String reasonForVisit) {
			this.reasonForVisit = reasonForVisit;
		}

		// Add an overloaded constructor that includes reasonForVisit
		public Appointment(Patient patient, Doctor doctor, LocalDate appointmentDate, String appointmentTime, String status, String reasonForVisit) {
			this.patient = patient;
			this.doctor = doctor;
			this.appointmentDate = appointmentDate;
			this.appointmentTime = appointmentTime;
			this.status = status;
			this.reasonForVisit = reasonForVisit;
		}
	}
