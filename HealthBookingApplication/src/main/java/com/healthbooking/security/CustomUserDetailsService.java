package com.healthbooking.security;

import com.healthbooking.model.User;
import com.healthbooking.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {
	
	@Autowired
    private  UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    
//  
   
    public UserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
    	Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            System.out.println("❌ User not found in DB: " + email);
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        User user = optionalUser.get();
        System.out.println("✅ User found: " + user.getEmail() + ", Role: " + user.getRole());

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
        );
    }


public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
	// TODO Auto-generated method stub
	return loadUserByEmail(email);
}
}

// public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//  Optional<User> optionalUser = userRepository.findByEmail(email);
//  
//  if (optionalUser.isEmpty()) {
//      throw new UsernameNotFoundException("User not found: " + email);
//  }
//
//  User user = optionalUser.get();
//
//  return org.springframework.security.core.userdetails.User
//          .withUsername(user.getEmail())
//          .password(user.getPassword()) // Password is already encoded
//          .authorities(Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))) // ✅ Convert role to GrantedAuthority
//          .build();
//}


