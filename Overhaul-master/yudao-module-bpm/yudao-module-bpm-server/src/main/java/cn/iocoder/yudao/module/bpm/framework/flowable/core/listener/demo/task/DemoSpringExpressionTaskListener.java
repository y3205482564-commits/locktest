package cn.iocoder.yudao.module.bpm.framework.flowable.core.listener.demo.task;

import lombok.extern.slf4j.Slf4j;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.delegate.TaskListener;
import org.flowable.task.service.delegate.DelegateTask;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

/**
 * 类型为 expression 的 TaskListener 监听器示例
 *
 * @author 芋道源码
 */
@Slf4j
@Component
public class DemoSpringExpressionTaskListener implements TaskListener {

//    public void notify(DelegateTask delegateTask) {
//        log.info("[execute][task({}) 被调用]", delegateTask.getId());
        // 输出 delegateTask 的变量
//        log.info("[execute][task({}) 变量有：{}]", delegateTask.getId(), delegateTask.getVariables());

        /*
        1.检修负责人：maintenance_supervisor
        2.参与人员：participating_personnel
         */


//    }


    /*
    @Override
    public void notify(DelegateTask delegateTask) {
        log.info("[execute][task({}) 被调用]", delegateTask.getId());
        // 输出 delegateTask 的变量
        log.info("[execute][task({}) 变量有：{}]", delegateTask.getId(), delegateTask.getVariables());

        try {
            // 1. 获取检修负责人和参与人员变量
            Object maintenanceSupervisorObj = delegateTask.getVariable("maintenance_supervisor");
            Object participatingPersonnelObj = delegateTask.getVariable("participating_personnel");

            // 2. 校验检修负责人是否存在
            if (maintenanceSupervisorObj == null) {
                log.warn("[notify][task({}) 检修负责人(maintenance_supervisor)为空]", delegateTask.getId());
                return;
            }

            // 3. 初始化参与人员列表（如果不存在则创建新列表）
            List<Object> participatingPersonnel;
            if (participatingPersonnelObj instanceof List) {
                participatingPersonnel = (List<Object>) participatingPersonnelObj;
            } else {
                participatingPersonnel = new ArrayList<>();
                log.info("[notify][task({}) 参与人员(participating_personnel)变量不是列表类型，创建新列表]", delegateTask.getId());
            }

            // 4. 将检修负责人添加到参与人员列表（避免重复添加）
            if (!participatingPersonnel.contains(maintenanceSupervisorObj)) {
                participatingPersonnel.add(maintenanceSupervisorObj);
                log.info("[notify][task({}) 已将检修负责人({})添加到参与人员列表]",
                        delegateTask.getId(), maintenanceSupervisorObj);
            } else {
                log.info("[notify][task({}) 检修负责人({})已存在于参与人员列表中，无需重复添加]",
                        delegateTask.getId(), maintenanceSupervisorObj);
            }

            // 5. 更新参与人员变量
            delegateTask.setVariable("participating_personnel", participatingPersonnel);

            // 打印更新后的变量信息
            log.info("[notify][task({}) 更新后参与人员列表：{}]",
                    delegateTask.getId(), delegateTask.getVariable("participating_personnel"));

        } catch (Exception e) {
            log.error("[notify][task({}) 添加检修负责人到参与人员列表失败]", delegateTask.getId(), e);
        }
    }


     */


    // 注入RuntimeService，用于操作流程实例级变量
    @Resource
    private RuntimeService runtimeService;

    // 常量定义：便于维护
    private static final Integer TARGET_ROOM_ID = 146;
    private static final String LICENSE_OBTAINED_KEY = "is_license_obtained";
    private static final String ROOM_ID_KEY = "roomId";

    @Override
    public void notify(DelegateTask delegateTask) {
        String taskId = delegateTask.getId();
        log.info("[execute][task({}) 监听器开始执行]", taskId);
        log.info("[execute][task({}) 当前变量：{}]", taskId, delegateTask.getVariables());

        try {
            // ========== 新增逻辑：处理roomId设置 ==========
            handleRoomIdSetting(delegateTask, taskId);

            // ========== 原有逻辑：添加检修负责人到参与人员 ==========
            // 1. 获取核心变量（严格匹配接口方法）
            Object maintenanceSupervisor = delegateTask.getVariable("maintenance_supervisor");
            Object participatingPersonnel = delegateTask.getVariable("participating_personnel");

            // 2. 校验检修负责人非空
            if (Objects.isNull(maintenanceSupervisor)) {
                log.warn("[notify][task({}) 检修负责人(maintenance_supervisor)为空，终止执行]", taskId);
                return;
            }

            // 3. 标准化参与人员列表（兼容空值/非列表场景）
            List<String> participantList = normalizeParticipantList(participatingPersonnel);

            // 4. 转换检修负责人为字符串（审批人通常是用户ID字符串）
            String supervisorStr = String.valueOf(maintenanceSupervisor);

            // 5. 避免重复添加
            if (!participantList.contains(supervisorStr)) {
                participantList.add(supervisorStr);
                log.info("[notify][task({}) 已添加检修负责人({})到参与人员列表]", taskId, supervisorStr);
            } else {
                log.info("[notify][task({}) 检修负责人({})已在参与人员列表中，无需重复添加]", taskId, supervisorStr);
            }

            // 6. 关键：双保险方案，确保后续任务可见
            // 方案1：更新流程实例级全局变量（所有节点可见）
            String executionId = delegateTask.getExecutionId();
            runtimeService.setVariable(executionId, "participating_personnel", participantList);
            log.info("[notify][task({}) 已更新流程实例({})的全局变量，参与人员：{}]",
                    taskId, executionId, participantList);

            // 方案2：直接添加到任务候选人列表（接口原生方法，审批人必见）
            delegateTask.addCandidateUsers((Collection<String>) participantList);
            log.info("[notify][task({}) 已更新任务候选人列表，候选人：{}]", taskId, participantList);

        } catch (Exception e) {
            log.error("[notify][task({}) 监听器执行失败]", taskId, e);
            // 异常不抛出去，避免流程中断
        }

        log.info("[execute][task({}) 监听器执行完成，最终变量：{}]", taskId, delegateTask.getVariables());
    }

    /**
     * 处理roomId设置逻辑：当is_license_obtained为true时，设置roomId为146
     */
    private void handleRoomIdSetting(DelegateTask delegateTask, String taskId) {
        // 1. 获取is_license_obtained变量
        Object licenseObtainedObj = delegateTask.getVariable(LICENSE_OBTAINED_KEY);

        // 2. 校验变量类型并判断值
        if (licenseObtainedObj instanceof Boolean && (Boolean) licenseObtainedObj) {
            String executionId = delegateTask.getExecutionId();
            // 设置为流程实例级全局变量，确保后续任务可见
            runtimeService.setVariable(executionId, ROOM_ID_KEY, TARGET_ROOM_ID);
            log.info("[handleRoomIdSetting][task({}) 检测到{}为true，已设置{}为{}]",
                    taskId, LICENSE_OBTAINED_KEY, ROOM_ID_KEY, TARGET_ROOM_ID);
        } else {
            log.info("[handleRoomIdSetting][task({}) {}值为{}，不设置roomId]",
                    taskId, LICENSE_OBTAINED_KEY, licenseObtainedObj);
        }
    }

    /**
     * 标准化参与人员列表：确保返回String类型的List，兼容各种异常场景
     */
    private List<String> normalizeParticipantList(Object originalObj) {
        List<String> resultList = new ArrayList<>();

        // 场景1：原始值是List
        if (originalObj instanceof List) {
            List<?> originalList = (List<?>) originalObj;
            for (Object item : originalList) {
                if (Objects.nonNull(item)) {
                    resultList.add(String.valueOf(item));
                }
            }
        }
        // 场景2：原始值非空且不是List（单个用户ID）
        else if (Objects.nonNull(originalObj)) {
            resultList.add(String.valueOf(originalObj));
        }
        // 场景3：原始值为空，返回空列表

        return resultList;
    }
}
