package com.healthbooking.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    // Forward all routes to index.html for the React router to handle
    @GetMapping(value = {"/", "/{path:^(?!api|assets).*$}/**"})
    public String forward() {
        return "forward:/index.html";
    }
} 