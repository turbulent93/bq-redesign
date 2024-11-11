namespace BqApi.Constants
{
    public class ErrorMessages
    {
        public const string SERVICE_ERROR = "Сервис не найден";
        public const string SPECIALIZATION_ERROR = "Специализация не найдена";
        public const string MASTER_ERROR = "Мастер не найден";
        public const string USER_ERROR = "Пользователь не найден";
        public const string ADMIN_CANNOT_BE_DELETED = "Админ не может быть удален";
        public const string SCHEDULE_ERROR = "День расписания не найден";
        public const string HAS_APPOINTMENT_ERROR = "Один или бололее дней расписания имеют запись";
        public const string APPOINTMENT_ERROR = "Запись не найдена";
        public const string FILE_ERROR = "Файл не найден";
        public const string PROMO_ERROR = "Промо не найдено";

        // token errors
        public const string AUTHENTICATE_ERROR = "Неправильный логин или пароль";
        public const string INVALID_ACCESS_TOKEN = "Невалидный Access Token";
        public const string INVALID_REFRESH_TOKEN = "Невалидный Refresh Token";
    }
}
