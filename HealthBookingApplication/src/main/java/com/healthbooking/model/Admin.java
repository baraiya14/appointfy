package com.healthbooking.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "admins")
//@DiscriminatorValue("ADMIN")
public class Admin extends User {

    @Column(nullable = false)
    private String fullName;
    
    @Column
    private String phone;
    
    @Column
    private LocalDate dateOfBirth;

//    @Column(nullable = false, unique = true)
//    private String email;

    public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(LocalDate dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public Admin() {}

    public Admin(String email, String password, String fullName) {
        super(email, password, "ROLE_ADMIN");
        this.fullName = fullName;
       // this.email = email;
    }
}
