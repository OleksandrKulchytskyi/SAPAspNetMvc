using System.Collections.Generic;
using System.Linq;
using SPAStarter.Contracts;
using SPAStarter.Models;

namespace SPAStarter.Controllers
{
    public class SessionBriefsController : ApiControllerBase
    {
        public SessionBriefsController(ISPAUow uow)
        {
            Uow = uow;
        }

        #region OData Future: IQueryable<T>
        //[Queryable]
        // public IQueryable<SessionBrief> Get()
        #endregion

        // GET /api/sessionbriefs
        public IEnumerable<SessionBrief> Get()
        {
            return Uow.Sessions.GetSessionBriefs()
                .OrderBy(sb => sb.TimeSlotId);
        }
    }
}