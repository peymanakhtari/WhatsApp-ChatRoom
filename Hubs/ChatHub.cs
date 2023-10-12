using Microsoft.AspNetCore.SignalR;
using whatsApp_chat.Data;
using whatsApp_chat.Data.models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace whatsApp_chat.Hubs
{
    public class ChatHub:Hub
    {
        private UnitOfWork db;
        public ChatHub(UnitOfWork _db) 
        { 
            db = _db;
        }
        public async Task SendMessage(string username,string name, string message)
        {
            var now = DateTime.Now;
            var time = now.ToString("HH:mm");
            var date = now.ToString("MM/dd/yyyy");
            await db.MessageRepository.InsertAsync(new Message { Username = username, Name = name, Datetime = now, MessageType = MessageType.text, Text = message });
            await db.SaveAsync();
            await Clients.All.SendAsync("ReceiveMessage", username,name, message,date,time);
        }
        public async Task joinChatRoom(string name, string username)
        {
            DateTime now = DateTime.Now;
            var time = now.ToString("HH:mm");
            var date = now.ToString("MM/dd/yyyy");
            await db.MessageRepository.InsertAsync(new Message() { Datetime = now, Username = username, Name = name, MessageType = MessageType.userJoin });
            await db.SaveAsync();
            await Clients.All.SendAsync("NewUserJoined", name.Split(',')[0],date,time);
        }
        public async Task MessageSeen(int messageId, string username)
        {
            await Clients.All.SendAsync("UpdateMessageSeen", username);
        }
        public async Task SendAudio(string name, string username, string fileName)
        {
            var now = DateTime.Now;
            var time = now.ToString("HH:mm");
            var date = now.ToString("MM/dd/yyyy");
            await db.MessageRepository.InsertAsync(new Message() { Datetime = now, Username = username, Name = name, MessageType = MessageType.voice, Text = fileName });
            await db.SaveAsync();
            await Clients.All.SendAsync("ReceiveAudio",username, name, date, time, fileName);
        }
        public async Task SendImage(string username,string name,string id,string imageName)
        {
            await Console.Out.WriteLineAsync("image send");
            var now = DateTime.Now;
            var time = now.ToString("HH:mm");
            var date = now.ToString("MM/dd/yyyy");
            await db.MessageRepository.InsertAsync( new Message() { Datetime=now,Username=username,Name=name,MessageType=MessageType.image,Text=imageName});
            await db.SaveAsync();
            await Clients.All.SendAsync("ReceiveImage", username, name,date,time,imageName,id);
        }
    }
}
