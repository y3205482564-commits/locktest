package cn.iocoder.cloud.lockdemo;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@MapperScan("cn.iocoder.cloud.lockdemo.mapper")
@SpringBootApplication
public class LockdemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(LockdemoApplication.class, args);
    }

}

