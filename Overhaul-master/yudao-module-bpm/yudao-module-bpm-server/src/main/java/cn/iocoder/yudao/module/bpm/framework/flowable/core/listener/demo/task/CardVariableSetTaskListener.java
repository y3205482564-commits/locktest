package cn.iocoder.yudao.module.bpm.framework.flowable.core.listener.demo.task;

import lombok.extern.slf4j.Slf4j;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.delegate.TaskListener;
import org.flowable.task.service.delegate.DelegateTask;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Objects;

/**
 * Flowable 任务监听器：仅当is_license_obtained为true时，设置流程变量card的值为「操作牌001」
 *
 * @author 芋道源码
 */
@Slf4j
@Component // 注册为Spring组件，支持Flowable表达式调用
public class CardVariableSetTaskListener implements TaskListener {

    // 注入RuntimeService，用于操作流程实例级全局变量
    @Resource
    private RuntimeService runtimeService;

    // 常量定义：便于后续维护和修改
    private static final String CARD_VARIABLE_KEY = "card"; // card变量名
    private static final String CARD_VARIABLE_VALUE = "操作牌001"; // 要设置的固定值
    private static final String LICENSE_OBTAINED_KEY = "is_license_obtained"; // 许可证获取状态变量名

    @Override
    public void notify(DelegateTask delegateTask) {
        String taskId = delegateTask.getId();
        log.info("[notify][task({}) 开始处理card变量设置逻辑]", taskId);

        try {
            // 1. 先判断is_license_obtained是否为true
            Boolean isLicenseObtained = getLicenseObtainedStatus(delegateTask, taskId);
            if (Boolean.FALSE.equals(isLicenseObtained)) {
                log.info("[notify][task({}) is_license_obtained为false，不设置card变量]", taskId);
                return; // 不满足条件，直接退出
            } else if (Objects.isNull(isLicenseObtained)) {
                log.warn("[notify][task({}) is_license_obtained变量不存在或类型异常，不设置card变量]", taskId);
                return;
            }

            // 2. 满足条件：获取流程实例ID（确保变量作用域为整个流程）
            String executionId = delegateTask.getExecutionId();
            if (Objects.isNull(executionId)) {
                log.warn("[notify][task({}) 流程实例ID为空，降级设置任务局部变量card]", taskId);
                // 降级方案：设置为任务局部变量
                delegateTask.setVariable(CARD_VARIABLE_KEY, CARD_VARIABLE_VALUE);
                log.info("[notify][task({}) 已降级设置任务局部变量card={}]", taskId, CARD_VARIABLE_VALUE);
                return;
            }

            // 3. 核心逻辑：设置流程实例级全局变量（所有后续任务可见）
            runtimeService.setVariable(executionId, CARD_VARIABLE_KEY, CARD_VARIABLE_VALUE);

            // 4. 验证设置结果并打印日志
            Object setValue = runtimeService.getVariable(executionId, CARD_VARIABLE_KEY);
            log.info("[notify][task({}) 成功设置流程全局变量card={}，验证值={}]",
                    taskId, CARD_VARIABLE_VALUE, setValue);

        } catch (Exception e) {
            log.error("[notify][task({}) 设置变量card失败]", taskId, e);
            // 异常不抛出，避免阻断整个流程
        }
    }

    /**
     * 获取is_license_obtained的状态，返回null表示变量异常
     */
    private Boolean getLicenseObtainedStatus(DelegateTask delegateTask, String taskId) {
        // 获取变量值
        Object licenseObtainedObj = delegateTask.getVariable(LICENSE_OBTAINED_KEY);

        // 校验变量类型
        if (Objects.isNull(licenseObtainedObj)) {
            log.warn("[getLicenseObtainedStatus][task({}) {}变量为空]", taskId, LICENSE_OBTAINED_KEY);
            return null;
        }
        if (!(licenseObtainedObj instanceof Boolean)) {
            log.warn("[getLicenseObtainedStatus][task({}) {}变量类型异常，实际类型={}]",
                    taskId, LICENSE_OBTAINED_KEY, licenseObtainedObj.getClass().getName());
            return null;
        }

        // 返回布尔值
        return (Boolean) licenseObtainedObj;
    }
}
