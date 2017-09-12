using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SREPSDataAccess;

namespace SRePs.Controllers
{
    public class ProductController : ApiController
    {
        //Get all products
        public List<StockData> Get()
        {
            using(SREPSDBEntities entities = new SREPSDBEntities())
            {
                return entities.StockData.ToList();
            }
        }
    }
}
