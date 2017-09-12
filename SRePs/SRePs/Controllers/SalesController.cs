﻿using System;
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
    public class SalesController : ApiController
    {
        private SREPSDBEntities db = new SREPSDBEntities();

        // GET: Sales
        public IQueryable<SalesData> GetSalesDatas()
        {
            return db.SalesData;
        }

        // GET: Sales/5
        [ResponseType(typeof(SalesData))]
        public IHttpActionResult GetSalesData(string id)
        {
            SalesData salesData = db.SalesData.Find(id);
            if (salesData == null)
            {
                return NotFound();
            }

            return Ok(salesData);
        }

        // PUT: Sales/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutSalesData(string id, SalesData salesData)
        {
            if (id != salesData.Sales_ID)
            {
                return BadRequest();
            }

            db.Entry(salesData).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SalesDataExists(id))
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

        // POST: Sales
        [ResponseType(typeof(SalesData))]
        public IHttpActionResult PostSalesData(SalesData salesData)
        {
            db.SalesData.Add(salesData);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (SalesDataExists(salesData.Sales_ID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = salesData.Sales_ID }, salesData);
        }

        // DELETE: Sales/5
        [ResponseType(typeof(SalesData))]
        public IHttpActionResult DeleteSalesData(string id)
        {
            SalesData salesData = db.SalesData.Find(id);
            if (salesData == null)
            {
                return NotFound();
            }

            db.SalesData.Remove(salesData);
            db.SaveChanges();

            return Ok(salesData);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SalesDataExists(string id)
        {
            return db.SalesData.Count(e => e.Sales_ID == id) > 0;
        }
    }
}