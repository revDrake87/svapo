package com.example.demo.config;

import com.example.demo.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

@Component
public class DatabaseSeeder {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DataSource dataSource;

    @PostConstruct
    public void seedDatabase() {
        if (userRepository.count() == 0) {
            ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
            populator.addScript(new ClassPathResource("data.sql"));
            populator.setContinueOnError(true); // Ignore errors if tables already have data
            populator.execute(dataSource);
        }
    }
}
