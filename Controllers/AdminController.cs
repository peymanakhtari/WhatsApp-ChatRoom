using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using whatsApp_chat.Data;
using whatsApp_chat.Data.models;

namespace whatsApp_chat.Controllers
{
    public class AdminController : Controller
    {
        private UnitOfWork db;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public AdminController(UnitOfWork _db, IWebHostEnvironment hostingEnvironment)
        {
            db = _db;
            _hostingEnvironment = hostingEnvironment; 
        }
        public IActionResult Index()
        {
            return View(db.MessageRepository.Get());
        }
        public IActionResult deleteMessage(int id, string messageType,string fileName)
        {

            string filePath= "";
            if (messageType == whatsApp_chat.Data.models.MessageType.image.ToString())
            {
                 filePath = Path.Combine(_hostingEnvironment.WebRootPath, "images", fileName);
            }
            else if (messageType == whatsApp_chat.Data.models.MessageType.voice.ToString())
            {
                 filePath = Path.Combine(_hostingEnvironment.WebRootPath, "Audios", fileName);
            }

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            db.MessageRepository.Delete(id);
            db.Save();
            return Ok();
        }
    }
}
