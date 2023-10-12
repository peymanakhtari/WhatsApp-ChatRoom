namespace whatsApp_chat.Data.models
{
    public class Message
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string Voice { get; set; }
        public string Image { get; set; }
        public DateTime Datetime { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
        public bool Seen { get; set; }
        public MessageType MessageType { get; set; }
    }

    public enum MessageType
    {
        text=1,
        voice=2,
        image=3,
        userJoin=4
    }
}
