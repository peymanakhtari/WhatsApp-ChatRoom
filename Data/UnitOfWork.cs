using whatsApp_chat.Data.models;

namespace whatsApp_chat.Data
{
    public class UnitOfWork : IDisposable
    {
        private AppDbContext context;
        private GenericRepository<Message> messageRepository;
        public GenericRepository<Message> MessageRepository
        {
            get
            {

                if (this.messageRepository == null)
                {
                    this.messageRepository = new GenericRepository<Message>(context);
                }
                return messageRepository;
            }
        }

        public UnitOfWork(AppDbContext _context) {
            this.context = _context;
        }

        public async Task SaveAsync()
        {
            await context.SaveChangesAsync();
        }
        public void Save()
        {
            context.SaveChanges();
        }
        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
