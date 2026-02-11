package cn.iocoder.yudao.module.bpm.framework.flowable.core.listener.demo.task;

import lombok.extern.slf4j.Slf4j;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.delegate.TaskListener;
import org.flowable.task.service.delegate.DelegateTask;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Objects;

/**
 * Flowable 任务监听器：专门用于设置流程变量teamAccount的值为150
 *
 * @author 芋道源码
 */
@Slf4j
@Component // 注册为Spring组件，支持Flowable表达式调用
public class TeamAccountSetTaskListener implements TaskListener {

    // 注入RuntimeService，用于操作流程实例级全局变量
    @Resource
    private RuntimeService runtimeService;

    // 常量定义：便于后续维护和修改
    private static final String TEAM_ACCOUNT_KEY = "teamAccount"; // 变量名
    private static final Integer TEAM_ACCOUNT_VALUE = 150; // 要设置的固定值

    @Override
    public void notify(DelegateTask delegateTask) {
        String taskId = delegateTask.getId();
        log.info("[notify][task({}) 开始设置流程变量teamAccount的值]", taskId);

        try {
            // 1. 获取流程实例ID（确保变量作用域为整个流程）
            String executionId = delegateTask.getExecutionId();
            if (Objects.isNull(executionId)) {
                log.warn("[notify][task({}) 流程实例ID为空，无法设置全局变量]", taskId);
                // 降级方案：设置为任务局部变量
                delegateTask.setVariable(TEAM_ACCOUNT_KEY, TEAM_ACCOUNT_VALUE);
                log.info("[notify][task({}) 已降级设置任务局部变量teamAccount={}]", taskId, TEAM_ACCOUNT_VALUE);
                return;
            }

            // 2. 核心逻辑：设置流程实例级全局变量（所有后续任务可见）
            runtimeService.setVariable(executionId, TEAM_ACCOUNT_KEY, TEAM_ACCOUNT_VALUE);

            // 3. 验证设置结果并打印日志
            Object setValue = runtimeService.getVariable(executionId, TEAM_ACCOUNT_KEY);
            log.info("[notify][task({}) 成功设置流程全局变量teamAccount={}，验证值={}]",
                    taskId, TEAM_ACCOUNT_VALUE, setValue);

        } catch (Exception e) {
            log.error("[notify][task({}) 设置变量teamAccount失败]", taskId, e);
            // 异常不抛出，避免阻断整个流程
        }
    }
}
