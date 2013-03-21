﻿using System.Collections.Generic;
using System.Linq;
using SPAStarter.Contracts;
using SPAStarter.Models;

namespace SPAStarter.Controllers
{
    public class FavoritesController : ApiControllerBase
    {
        public FavoritesController(ICodeCamperUow uow)
        {
            Uow = uow;
        }

        #region OData Future: IQueryable<T>
        //[Queryable]
        // public IQueryable<Attendance> Get()
        #endregion

        // GET: api/favorites/{personId}
        public IEnumerable<Attendance> GetByPersonId(int id)
        {
            return Uow.Attendance.GetByPersonId(id)
                .OrderBy(ps => ps.Session.Title);
        }
    }
}