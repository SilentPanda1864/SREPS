﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using SREPSDataAccess;

namespace SRePs.Controllers
{
    public class SalesDataController : ApiController
    {
        private SREPSDBEntities db = new SREPSDBEntities();

        // GET: api/SalesData
        public IQueryable<SalesData> GetSalesDatas()
        {
            return db.SalesDatas;
        }

        // GET: api/SalesData/5
        [ResponseType(typeof(SalesData))]
        public IHttpActionResult GetSalesData(int id)
        {
            IEnumerable<SalesData> salesData = db.SalesDatas.Where(e => e.Sales_ID == id);
            if (salesData.Count() == 0)
            {
                return NotFound();
            }

            return Ok(salesData);
        }

        // PUT: api/SalesData/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutSalesData(int id, SalesData[] saleData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //get all data
            var result = db.SalesDatas.Where(e => e.Sales_ID == id);
            //remove it
            foreach (SalesData oldData in result)
            {
                db.SalesDatas.Remove(oldData);
            }
            //Add new data
            foreach (SalesData newData in saleData)
            {
                db.SalesDatas.Add(newData);
            }
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/SalesData
        [ResponseType(typeof(SalesData))]
        public IHttpActionResult PostSalesData([FromBody]SalesData[] salesData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            foreach(SalesData data in salesData)
                db.SalesDatas.Add(data);

            try
            {
                try
                {
                    db.SaveChanges();
                }
                catch (DbEntityValidationException e)
                {

                    foreach (var eve in e.EntityValidationErrors)
                    {
                        Console.WriteLine(
                            "Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                            eve.Entry.Entity.GetType().Name, eve.Entry.State);
                        foreach (var ve in eve.ValidationErrors)
                        {
                            Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                                ve.PropertyName, ve.ErrorMessage);
                        }
                    }
                    throw;
                }
            }
            catch (DbUpdateException)
            {
                foreach (SalesData data in salesData)
                {
                    if (SalesDataExists(data.Sales_ID, data.Product_Name))
                    {
                        return Conflict();
                    }
                    else
                    {
                        throw;
                    }
                }
            }

            return CreatedAtRoute("DefaultApi", new { sales_ID = salesData[0].Sales_ID}, salesData);
        }

        // DELETE: api/SalesData/5
        [ResponseType(typeof(SalesData))]
        public IHttpActionResult DeleteSalesData(int id)
        {
            IEnumerable<SalesData> salesData = db.SalesDatas.Where(e => e.Sales_ID == id);
            if (salesData.Count() == 0)
            {
                return NotFound();
            }
            foreach(SalesData data in salesData)
                db.SalesDatas.Remove(data);
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

        private bool SalesDataExists(int id, string name)
        {
            return db.SalesDatas.Count(e => (e.Sales_ID == id && e.Product_Name == name)) > 0;
        }
        private bool SalesDataExists(int id)
        {
            return db.SalesDatas.Count(e => (e.Sales_ID == id)) > 0;
        }
    }
}