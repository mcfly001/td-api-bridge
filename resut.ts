interface Icontents {
    id?: number;
    uuid?: string;
    /**  客户姓名 */
    customerName?: string;

    /**  客户类型 */
    customerType?: string;

    /**  客户编号 */
    customerNo?: string;

    /**  证件号 */
    creditId?: string;

    /**  手机号 */
    phone?: string;

    /**  预警编号 */
    alarmNo?: string;

    /**  任务编号 */
    taskNo?: string;

    /**  预警等级 */
    alarmLevel?: string;

    /**  状态 */
    status?: string;

    /**  预警时间 */
    gmtAlarm?: string;

    /**  客户经理 */
    customerManager?: string;

    /** 审批结果 */
    approvalStatus?: string;

    /** 审批结果 */
    approvalStatusName?: string;
}
interface Idata {
    total?: number;
    curPage?: number;
    pageSize?: number;
    contents?: Icontents[];
}
interface Result {
    /**  成功 */
    success?: string;
    code?: number;
    message?: string;
    data?: Idata;
}
