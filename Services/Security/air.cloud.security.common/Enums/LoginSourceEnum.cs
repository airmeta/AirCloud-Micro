namespace air.cloud.security.common.Enums
{
    /// <summary>
    /// <para>zh-cn:登录来源枚举</para>
    /// <para>en-us:Login Source Enum</para>
    /// </summary>
    public enum  LoginSourceEnum
    {
        管理端 = 1,
        //下列的四种类型登录来源都可以定义为 "应用端" 使用人都是 普通用户 只能看自己的数据
        移动端 = 2,
        PC端 = 3,
        微信小程序=4,
        支付宝小程序=5
    }
}
