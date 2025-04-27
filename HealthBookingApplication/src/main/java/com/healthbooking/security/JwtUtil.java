package com.healthbooking.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtUtil {
    private final String SECRET_KEY = "your-256-bit-secret-your-256-bit-secret";
    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

//    public String 	generateToken(UserDetails userDetails) {
//        return Jwts.builder()
//                .setSubject(userDetails.getUsername())
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
//                .signWith(key, SignatureAlgorithm.HS256)
//                .compact();
//    }
    
    public String generateToken(UserDetails userDetails, Long userId) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("id", userId) // Store patientId in token
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(key, SignatureAlgorithm.HS256) 
                .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public Long extractId(String token) {
        return extractAllClaims(token).get("id", Long.class);  // ✅ Fix claim extraction
    }

    public Claims getClaims(String token) {
    	return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }
    
//    public Long extractId(String token) {
//        Claims claims = Jwts.parser()
//                .setSigningKey(SECRET_KEY)
//                .parseClaimsJws(token)
//                .getBody();
//        return getClaims(token).get("id", Long.class);
//        //return Long.parseLong(claims.get("id").toString()); // Assuming the token stores "id"
//    } 
//    
//    public Claims getClaims(String token) {
//        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
//    }
    
//    private String createToken(Map<String, Object> claims, String subject) {
//        return Jwts.builder()
//                .setClaims(claims)
//                .setSubject(subject)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10-hour expiry
//                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
//                .compact();
//    }
}
