namespace air.cloud.security.common.Exceptions
{
    public  class AuthException:Exception
    {
        public AuthException(string Code,string Message):base($"{Code}:{Message}")
        {
        }
    }
}
