package com.healthbooking.repository;

import com.healthbooking.model.Appointment;
import com.healthbooking.model.Doctor;
import com.healthbooking.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(Patient patient);
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    @Query("SELECT DISTINCT a FROM Appointment a WHERE a.patient = :patient")
    List<Appointment> findDistinctByPatient(@Param("patient") Patient patient);
    List<Appointment> findByPatientOrderByAppointmentDateDesc(Patient patient);
    List<Appointment> findByDoctorOrderByAppointmentDateDesc(Doctor doctor);
    List<Appointment> findByDoctorAndAppointmentDateAndAppointmentTime(Doctor doctor, LocalDate appointmentDate, String appointmentTime);
    List<Appointment> findByAppointmentDateAndStatus(LocalDate date, String status);
    List<Appointment> findByStatusOrderByAppointmentDateDesc(String status);
}


