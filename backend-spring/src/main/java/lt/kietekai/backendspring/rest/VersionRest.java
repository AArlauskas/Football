package lt.kietekai.backendspring.rest;

import lt.kietekai.backendspring.rest.models.Version;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/")
public class VersionRest {
    @GetMapping("/version")
    public Version version() {
        return new Version("1.0.0", LocalDateTime.now());
    }
}
