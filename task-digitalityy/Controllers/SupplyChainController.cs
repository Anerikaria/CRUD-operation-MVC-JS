using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using task_digitalityy.Models;


namespace task_digitalityy.Controllers
{
    public class SupplyChainController : Controller
    {
        private spChainEntities2 db = new spChainEntities2();
        // GET: SupplyChain
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetItemsData()
        {
            {
                db.Configuration.ProxyCreationEnabled = false;
                var splist = db.SupplyChains.OrderBy(i => i.Id).ToList();
                return Json(splist, JsonRequestBehavior.AllowGet);

            }
        }

        public JsonResult GetItems(int? id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            SupplyChain spitem = db.SupplyChains.Find(id);

            return new JsonResult { Data = spitem, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [HttpPost]
        [Route("SupplyChain/AddSPchain")]
        public ActionResult AddSPchain(SupplyChain sp)
        {

             //sp = db.SupplyChains.Where(t => t.Id == Id).FirstOrDefault();
            
            db.SupplyChains.Add(sp);
            try
            {
                db.SaveChanges();

            }
            catch (Exception error)
            {
                return new JsonResult { Data = error, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            string message = "SUCCESS";
            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }

        [HttpPost]
        [Route("SupplyChain/EditSPchain")]
        public JsonResult EditSPchain(SupplyChain sp)
        {
            var s = db.SupplyChains.Where(k => k.Id == sp.Id).FirstOrDefault();
            if (s != null)
            {
                s.Name = sp.Name;
                db.SaveChanges();
                return new JsonResult { Data = "Updated", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            else
            {
                return new JsonResult { Data = "Failed", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }


        [HttpPost]
        [Route("SupplyChain/DeleteSPchain")]
        public JsonResult DeleteSPchain(int? Id)
        {
            SupplyChain sp = db.SupplyChains.Find(Id);
            db.SupplyChains.Remove(sp);
            db.SaveChanges();
            return new JsonResult { Data = "Deleted", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult SPchainCount()
        {
            db.Configuration.ProxyCreationEnabled = false;
            var sp = db.SupplyChains;
            return new JsonResult { Data = sp.Count(), JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }


    }
}