//
//package com.healthbooking.security;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.web.firewall.HttpFirewall;
//import org.springframework.security.web.firewall.StrictHttpFirewall;
//
//@Configuration
//public class FirewallConfig {
//
//    @Bean
//    public HttpFirewall allowUrlEncodedPercent() {
//    	StrictHttpFirewall firewall = new StrictHttpFirewall();
//    	firewall.setAllowUrlEncodedNewLine(true);  // Allow %0A (newline)
//    	firewall.setAllowUrlEncodedPercent(true);  // Allow % character
//    	return firewall;
//    }
//}

package com.healthbooking.security;

import java.util.List;
import java.util.ArrayList;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;

@Configuration
public class FirewallConfig {

    @Bean
    public HttpFirewall allowUrlEncodedNewlineHttpFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();  
        // Allow percent-encoded slash
        firewall.setAllowUrlEncodedPercent(true);
        
        // You can also try other available settings
        firewall.setAllowSemicolon(true);
        firewall.setAllowUrlEncodedSlash(true);
        firewall.setAllowUrlEncodedPeriod(true);
        
        return firewall;
    }
}

