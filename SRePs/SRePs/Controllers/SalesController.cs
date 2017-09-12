using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SREPSDataAccess;

namespace SRePs.Controllers
{
    public class SalesController : ApiController
    {
        //Get all sales records
        public List<SalesData> Get()
        {
            using (SREPSDBEntities enttites = new SREPSDBEntities())
            {
                return enttites.SalesData.ToList();
            }
        }
    }
}
