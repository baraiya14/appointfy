package com.healthbooking.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "doctors")
@Getter  
@Setter
// @NoArgsConstructor // ✅ Generates No-Args Constructor (needed for JPA)
@DiscriminatorValue("DOCTOR")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Doctor extends User {
	
	 public Doctor() {
	    }
	 

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private boolean available = true; // ✅ Default availability
    
    // Add date of birth field
    private LocalDate dateOfBirth;

    public String getFullName() {
		return fullName;
	}

	public String getSpecialization() {
		return specialization;
	}

//	public String getEmail() {
//		return email;
//	}

	public String getPhone() {
		return phone;
	}

	public boolean isAvailable() {
		return available;
	}
	
	public LocalDate getDateOfBirth() {
	    return dateOfBirth;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public void setSpecialization(String specialization) {
		this.specialization = specialization;
	}

//	public void setEmail(String email) {
//		this.email = email;
//	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public void setAvailable(boolean available) {
		this.available = available;
	}
	
	public void setDateOfBirth(LocalDate dateOfBirth) {
	    this.dateOfBirth = dateOfBirth;
	}

	// ✅ Constructor for creating a new Doctor
    public Doctor(String email, String password, String fullName, String specialization, String phone) {
        super(email, password, "ROLE_DOCTOR"); // ✅ Call Parent Constructor
        this.fullName = fullName;
        this.specialization = specialization;
        this.phone = phone;
    }
}
