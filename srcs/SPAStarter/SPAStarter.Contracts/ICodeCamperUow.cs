using SPAStarter.Models;

namespace SPAStarter.Contracts
{
	/// <summary>
	/// Interface for the Code Camper "Unit of Work"
	/// </summary>
	public interface ISPAUow
	{
		// Save pending changes to the data store.
		void Commit();

		// Repositories
		IPersonsRepository Persons { get; }

		IRepository<Room> Rooms { get; }

		ISessionsRepository Sessions { get; }

		IRepository<TimeSlot> TimeSlots { get; }

		IRepository<Track> Tracks { get; }

		IAttendanceRepository Attendance { get; }
	}
}