package cn.iocoder.cloud.lockdemo.config;

import org.springframework.context.annotation.Configuration;

/**
 * MyBatis Plus配置类
 * 注意：如果需要分页功能，请确保 MyBatis Plus 依赖已正确引入，
 * 然后取消注释下面的分页插件配置
 */
@Configuration
public class MybatisPlusConfig {
    
    // 分页插件配置（暂时注释，避免编译错误）
    // 如果需要启用分页功能，请确保 MyBatis Plus 版本正确，然后取消注释
    /*
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        PaginationInnerInterceptor paginationInnerInterceptor = new PaginationInnerInterceptor(DbType.MYSQL);
        interceptor.addInnerInterceptor(paginationInnerInterceptor);
        return interceptor;
    }
    */
}

