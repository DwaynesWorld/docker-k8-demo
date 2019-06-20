using System;
using System.Collections.Generic;
using System.Threading;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly Random _rand;

        public EventsController()
        {
            _rand = new Random();
        }

        [HttpGet("{time}")]
        public ActionResult<double> GetNewEvent(long time)
        {
            LongRunningMethod();

            return (Math.Sin(time / 10000000) * 350 + 500 + _rand.NextDouble() * 1000);
        }

        private void LongRunningMethod()
        {
            // Thread.Sleep(1000);
            var values = new List<double>();
            for (int i = 0; i < 50000; i++)
            {
                values.Add(_rand.Next(1000, 1000000) * _rand.NextDouble());
            }
        }
    }
}
