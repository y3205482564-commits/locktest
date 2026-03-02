package cn.iocoder.yudao.module.digitalCard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 项目的启动类
 *
 * @author 系统管理
 */
@SpringBootApplication
public class DigitalCardServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(DigitalCardServerApplication.class, args);
    }

//    @Bean
//    @ConditionalOnMissingBean(List.class)
//    public List<AuthorizeRequestsCustomizer> emptyAuthorizeRequestsCustomizers() {
//        return new ArrayList<>();
//    }

}
