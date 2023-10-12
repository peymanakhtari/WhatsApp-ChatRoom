using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using whatsApp_chat.Data;
using whatsApp_chat.Data.models;
using whatsApp_chat.Models;

namespace whatsApp_chat.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly IWebHostEnvironment _hostingEnvironment;
    private UnitOfWork db;

    public HomeController(ILogger<HomeController> logger, UnitOfWork _db, IWebHostEnvironment hostingEnvironment)
    {
        _logger = logger;
        db = _db;
        _hostingEnvironment = hostingEnvironment; ;
    }

    public IActionResult Index()
    {
        var model = db.MessageRepository.Get();
        return View(model);
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }

    [HttpPost]
    public IActionResult SetCookie(string name)
    {
        var cookieOptions = new CookieOptions();
        cookieOptions.Expires = DateTime.Now.AddYears(1);
        string username = Guid.NewGuid().ToString();
        Response.Cookies.Append("name", name, cookieOptions);
        Response.Cookies.Append("username", username, cookieOptions);
        return Json($"{name},{username}");
    }
    [HttpPost]
    public async Task<IActionResult> UploadAudio(IFormFile audio,string id)
    {
        //---------------- THIS CODE IS FROM CHAT GPT--------------------
        if (audio != null && audio.Length > 0)
        {
            try
            {
                // Get the path to the wwwroot directory
                string webRootPath = _hostingEnvironment.WebRootPath;

                // Construct the path to the "Audios" folder inside wwwroot
                string uploadPath = Path.Combine(webRootPath, "Audios");

                // Ensure the "Audios" folder exists; create it if it doesn't
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                // Generate a unique file name (e.g., using a GUID) to avoid naming conflicts
                string uniqueFileName = id + audio.FileName;

                // Combine the upload path and the unique file name
                string filePath = Path.Combine(uploadPath, uniqueFileName);

                // Save the uploaded audio to the specified file path
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await audio.CopyToAsync(stream);
                }

                // You can optionally store the file path in a database or return it in the response
                // For now, just return a success response
                return Ok("Audio uploaded successfully");
            }
            catch (Exception ex)
            {
                // Handle any exceptions that occur during processing
                // You can log the exception for debugging purposes
                // Return an error response
                return BadRequest("Error processing audio: " + ex.Message);
            }
        }
        return BadRequest();    
    }
    [HttpPost]
    public async Task<IActionResult> UploadImage(IFormFile image)
    {
        if (image != null && image.Length > 0)
        {
            try
            {
                // Get the path to the wwwroot directory
                string webRootPath = _hostingEnvironment.WebRootPath;

                // Construct the path to the "Images" folder inside wwwroot
                string uploadPath = Path.Combine(webRootPath, "Images");

                // Ensure the "Images" folder exists; create it if it doesn't
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                // Generate a unique file name (e.g., using a GUID) to avoid naming conflicts
                var guid= Guid.NewGuid().ToString();
                string uniqueFileName = guid+ Path.GetExtension(image.FileName);

                // Combine the upload path and the unique file name
                string filePath = Path.Combine(uploadPath, uniqueFileName);

                // Save the uploaded image to the specified file path
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                // You can optionally store the file path in a database or return it in the response
                // For now, just return a success response
                await Console.Out.WriteLineAsync(filePath);
                return Ok(new { fileName = uniqueFileName,Id=guid });
            }
            catch (Exception ex)
            {
                // Handle any exceptions that occur during processing
                // You can log the exception for debugging purposes
                // Return an error response
                return BadRequest("Error processing image: " + ex.Message);
            }
        }

        return BadRequest("No image file uploaded");
    }
    public IActionResult SignOutUser()
    {
        Response.Cookies.Delete("name");
        Response.Cookies.Delete("username");

        return RedirectToAction("Index");
    }
}
