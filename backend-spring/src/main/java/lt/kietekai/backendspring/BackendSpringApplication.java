package lt.kietekai.backendspring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class BackendSpringApplication {

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone(System.getenv().getOrDefault("TZ", "UTC")));
        SpringApplication.run(BackendSpringApplication.class, args);
    }

}
