package one.oneride;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class    OnerideApplication {

    public static void main(String[] args) {

        SpringApplication.run(
                OnerideApplication.class,
                args
        );
    }
}