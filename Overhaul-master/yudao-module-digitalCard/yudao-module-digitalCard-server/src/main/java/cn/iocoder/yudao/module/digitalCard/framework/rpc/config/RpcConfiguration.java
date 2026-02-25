package cn.iocoder.yudao.module.digitalCard.framework.rpc.config;

import cn.iocoder.yudao.module.system.api.user.AdminUserApi;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;

/**
 * RPC 配置类
 * 用于启用 Feign 客户端
 */
@Configuration(value = "digitalCardRpcConfiguration", proxyBeanMethods = false)
@EnableFeignClients(clients = {AdminUserApi.class})
public class RpcConfiguration {
}

