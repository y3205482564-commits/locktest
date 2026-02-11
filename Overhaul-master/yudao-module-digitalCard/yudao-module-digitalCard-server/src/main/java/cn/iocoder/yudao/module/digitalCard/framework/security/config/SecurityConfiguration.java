package cn.iocoder.yudao.module.digitalCard.framework.security.config;

import cn.iocoder.yudao.framework.security.config.AuthorizeRequestsCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;

/**
 * 数字卡片模块的 Security 配置
 */
@Configuration(proxyBeanMethods = false, value = "digitalCardSecurityConfiguration")
public class SecurityConfiguration {

    @Bean("digitalCardAuthorizeRequestsCustomizer")
    public AuthorizeRequestsCustomizer authorizeRequestsCustomizer() {
        return new AuthorizeRequestsCustomizer() {

            @Override
            public void customize(AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry registry) {
                // 1. 可选：添加数字卡片模块需要放行的接口（根据你的业务调整）
                // 比如：数字卡片相关接口无需登录（仅示例，根据实际权限需求改）
                registry.requestMatchers("/admin-api/digitalCard/**").permitAll();

                // 2. 通用放行：Swagger 文档、Druid 监控、Actuator（和 BPM 模块保持一致）
                registry.requestMatchers("/v3/api-docs/**").permitAll()
                        .requestMatchers("/webjars/**").permitAll()
                        .requestMatchers("/swagger-ui").permitAll()
                        .requestMatchers("/swagger-ui/**").permitAll();
                registry.requestMatchers("/druid/**").permitAll();
                registry.requestMatchers("/actuator").permitAll()
                        .requestMatchers("/actuator/**").permitAll();
            }

        };
    }

}
