package com.cyberpunk.neoncity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StreamUtils;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestTemplate; // Import RestTemplate
import com.fasterxml.jackson.databind.JsonNode; // For parsing JSON response from GitHub API
import com.fasterxml.jackson.databind.ObjectMapper; // For parsing JSON response from GitHub API

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController // Marks this class as a REST controller
@CrossOrigin(origins = "*") // Allows requests from any origin (for development, consider specific origins
                            // for production)
public class SystemStatusController {

    private final RestTemplate restTemplate = new RestTemplate(); // Initialize RestTemplate
    private final ObjectMapper objectMapper = new ObjectMapper(); // Initialize ObjectMapper for JSON parsing

    /**
     * Handles GET requests to /api/status and returns a map of system information.
     * This simulates fetching dynamic data from the backend.
     * 
     * @return A Map containing system status details.
     */
    @GetMapping("/api/status") // Maps this method to the /api/status endpoint
    public Map<String, String> getSystemStatus() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "ONLINE");
        status.put("version", "2.1.0-beta");
        status.put("last_update", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        status.put("server_load", String.format("%.2f%%", Math.random() * 100)); // Random load for demo
        status.put("message", "Neural network operational. Data streams flowing.");
        return status;
    }

    /**
     * Handles GET requests to /api/mission and returns a mock mission log.
     * 
     * @return A Map containing mission log details.
     */
    @GetMapping("/api/mission")
    public Map<String, String> getMissionLog() {
        Map<String, String> mission = new HashMap<>();
        mission.put("mission_id", "MX-7B-9");
        mission.put("objective", "Retrieve encrypted data from Sector 7G.");
        mission.put("status", "PENDING");
        mission.put("priority", "HIGH");
        mission.put("agent", "GhostRunner");
        mission.put("deadline", "2077-07-25 03:00:00");
        return mission;
    }

    /**
     * Handles GET requests to /api/cv and reads content from 'cv.txt' file.
     * This allows dynamic content for the About Me section from a text file.
     * 
     * @return The content of the 'cv.txt' file as a String.
     */
    @GetMapping(value = "/api/cv", produces = "text/plain;charset=UTF-8")
    public String getCvContent() {
        try {
            // ClassPathResource looks for the file in the classpath, typically
            // src/main/resources
            ClassPathResource resource = new ClassPathResource("cv.txt");
            if (!resource.exists()) {
                return "ERROR: 'cv.txt' not found in resources. Please create the file.";
            }
            // Read the content of the file into a String
            return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            // Log the exception for debugging
            e.printStackTrace();
            return "ERROR: Could not read 'cv.txt'. Details: " + e.getMessage();
        }
    }

    /**
     * Handles GET requests to /api/projects and returns a list of project
     * information.
     * This version now fetches data from GitHub API.
     * 
     * @return A List of Maps, each representing a project from GitHub.
     */
    @GetMapping("/api/projects")
    public List<Map<String, String>> getGithubProjects() {
        List<Map<String, String>> projects = new ArrayList<>();
        String githubUsername = "DomiTe"; // <<< IMPORTANT: Replace with YOUR GitHub username!

        try {
            String url = "https://api.github.com/users/" + githubUsername + "/repos?sort=updated&direction=desc";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                if (root.isArray()) {
                    for (JsonNode node : root) {
                        Map<String, String> project = new HashMap<>();
                        project.put("title", node.path("name").asText());
                        project.put("description", node.path("description").asText("No description available."));
                        project.put("url", node.path("html_url").asText());
                        project.put("language", node.path("language").asText("N/A"));
                        project.put("last_updated", node.path("updated_at").asText());
                        projects.add(project);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Fallback to static data or return an empty list with an error message
            Map<String, String> errorProject = new HashMap<>();
            errorProject.put("title", "Error Fetching Projects");
            errorProject.put("status", "OFFLINE");
            errorProject.put("description", "Could not retrieve projects from GitHub. Check backend logs for details.");
            errorProject.put("url", "#");
            projects.add(errorProject);
        }
        return projects;
    }
}