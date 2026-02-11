package cn.iocoder.yudao.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
/**
 * 网关服务
 * 安全认证功能
 * 接口转发功能-原有功能按规则转转发,业务功能按application.name转发
 * 接口文档地址  http://127.0.0.1:48080/doc.html
 *
 * @author yj
 * @Date 2025/12/20 18:30
 */
@SpringBootApplication
public class GatewayServerApplication {

    public static void main(String[] args) {
        // 启动 Spring Boot 应用
        SpringApplication.run(GatewayServerApplication.class, args);
    }
}
