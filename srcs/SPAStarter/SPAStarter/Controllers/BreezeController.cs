using Breeze.WebApi;
using SPAStarter.Models;
using System.Linq;
using System.Web.Http;

namespace SPAStarter.Controllers
{
	[Breeze.WebApi.BreezeController]
	public class BreezeController : ApiController
	{
		private readonly EFContextProvider<SPAStarter.Data.CodeCamperDbContext> _contextProvider;

		public BreezeController()
		{
			_contextProvider = new EFContextProvider<Data.CodeCamperDbContext>();
		}

		[HttpGet]
		public string Metadata()
		{
			return _contextProvider.Metadata();
		}

		[HttpPost]
		public SaveResult SaveChanges(Newtonsoft.Json.Linq.JObject saveBundle)
		{
			return _contextProvider.SaveChanges(saveBundle);
		}

		[HttpGet]
		public object Lookups()
		{
			var rooms = _contextProvider.Context.Rooms;
			var tracks = _contextProvider.Context.Tracks;
			var timeSlots = _contextProvider.Context.TimeSlots;
			return new { rooms, tracks, timeSlots };
		}

		[HttpGet]
		public IQueryable<Session> Sessions()
		{
			return _contextProvider.Context.Sessions;
		}

		[HttpGet]
		public IQueryable<Person> Persons()
		{
			return _contextProvider.Context.Persons;
		}

		[HttpGet]
		public IQueryable<Person> Speakers()
		{
			return _contextProvider.Context.Persons
				.Where(p => p.SpeakerSessions.Any());
		}

		protected override void Dispose(bool disposing)
		{
			base.Dispose(disposing);
		}
	}
}