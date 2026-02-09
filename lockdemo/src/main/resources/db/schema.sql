-- 设备信息表
CREATE TABLE IF NOT EXISTS bluetooth_base (
    id VARCHAR(64) PRIMARY KEY COMMENT '设备ID',
    lock_num VARCHAR(100) COMMENT '锁具编号',
    mac VARCHAR(20) COMMENT 'MAC地址',
    blue_type VARCHAR(10) COMMENT '锁类型（0/2/3）',
    password VARCHAR(255) COMMENT '密码',
    secret_key VARCHAR(255) COMMENT '密钥',
    use_count INT DEFAULT 0 COMMENT '使用次数',
    last_user VARCHAR(100) COMMENT '上次使用人',
    last_use_time DATETIME COMMENT '上次使用时间',
    is_instruct_closed VARCHAR(1) DEFAULT '0' COMMENT '是否有关锁功能（0/1）',
    answer_question VARCHAR(1) DEFAULT '0' COMMENT '是否需要答题（0/1）',
    elect_quantity INT COMMENT '电量',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_mac (mac)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='蓝牙设备信息表';

-- 使用记录表
CREATE TABLE IF NOT EXISTS use_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '记录ID',
    bluetooth_id VARCHAR(64) COMMENT '设备ID',
    user_id VARCHAR(64) COMMENT '用户ID',
    lock_status INT COMMENT '锁状态（1=开锁，0=关锁）',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_bluetooth_id (bluetooth_id),
    INDEX idx_user_id (user_id),
    INDEX idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='锁使用记录表';

