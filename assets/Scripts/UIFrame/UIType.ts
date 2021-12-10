/**窗口位置类型 */
export enum UIFormType {
    None = 0,
    /**普通 */
    Normal,
    /**固定 非全屏弹窗*/
    Fixed,
    /**弹窗 */
    PopUp,
}

/**UI窗口的显示类型*/
export enum UIFormShowMode {
    None = 0,
    /**普通 */
    Normal,
    /**反向切换 */
    ReverseChange,
    /**隐藏其他 */
    HideOther,
}