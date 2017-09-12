using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using SREPSDataAccess;

namespace SRePs.Controllers
{
    public class StockController : ApiController
    {
        private SREPSDBEntities db = new SREPSDBEntities();

        // GET: Stock
        public IQueryable<StockData> GetStockDatas()
        {
            return db.StockData;
        }

        // GET: Stock/5
        [ResponseType(typeof(StockData))]
        public IHttpActionResult GetStockData(string id)
        {
            StockData stockData = db.StockData.Find(id);
            if (stockData == null)
            {
                return NotFound();
            }

            return Ok(stockData);
        }

        // PUT: Stock/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutStockData(string id, StockData stockData)
        {
            if (id != stockData.Product_ID)
            {
                return BadRequest();
            }

            db.Entry(stockData).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StockDataExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: Stock
        [ResponseType(typeof(StockData))]
        public IHttpActionResult PostStockData(StockData stockData)
        {
            db.StockData.Add(stockData);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (StockDataExists(stockData.Product_ID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = stockData.Product_ID }, stockData);
        }

        // DELETE: Stock/5
        [ResponseType(typeof(StockData))]
        public IHttpActionResult DeleteStockData(string id)
        {
            StockData stockData = db.StockData.Find(id);
            if (stockData == null)
            {
                return NotFound();
            }

            db.StockData.Remove(stockData);
            db.SaveChanges();

            return Ok(stockData);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StockDataExists(string id)
        {
            return db.StockData.Count(e => e.Product_ID == id) > 0;
        }
    }
}