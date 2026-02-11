package cn.iocoder.yudao.module.digitalCard.model.vo.mock;

import lombok.Data;

/**
 * 班组选择VO类
 * 用于前端展示/选择班组时传递的视图对象
 */
@Data
public class TeamSelectVO {

    /**
     * 班组名称
     */
    private String teamName;

    /**
     * 班组账号
     */
    private Long teamAccount;

}
