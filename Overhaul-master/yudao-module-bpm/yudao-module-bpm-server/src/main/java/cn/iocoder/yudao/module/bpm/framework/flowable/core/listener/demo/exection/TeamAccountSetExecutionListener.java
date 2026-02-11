package cn.iocoder.yudao.module.bpm.framework.flowable.core.listener.demo.exection;

import lombok.extern.slf4j.Slf4j;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;

/**
 * Flowable 执行监听器：将流程变量teamAccount设置为150
 * （实现JavaDelegate接口，作为executionListener使用）
 *
 * @author Abu
 */
@Slf4j
public class TeamAccountSetExecutionListener implements JavaDelegate {

    // 常量定义：便于维护和修改
    private static final String TEAM_ACCOUNT_KEY = "teamAccount";
    private static final Integer TEAM_ACCOUNT_VALUE = 151;

    @Override
    public void execute(DelegateExecution execution) {
        log.info("[execute][execution({}) 被调用！变量有：{}]", execution.getId(),
                execution.getCurrentFlowableListener().getFieldExtensions());

        try {
            // 核心逻辑：设置流程变量teamAccount为150
            execution.setVariable(TEAM_ACCOUNT_KEY, TEAM_ACCOUNT_VALUE);

            // 验证设置结果并打印日志
            Object setValue = execution.getVariable(TEAM_ACCOUNT_KEY);
            log.info("[execute][execution({}) 成功设置流程变量{}={}，验证值={}]",
                    execution.getId(), TEAM_ACCOUNT_KEY, TEAM_ACCOUNT_VALUE, setValue);

        } catch (Exception e) {
            log.error("[execute][execution({}) 设置变量teamAccount失败]", execution.getId(), e);
            // 异常不抛出，避免阻断流程执行
        }
    }

}
