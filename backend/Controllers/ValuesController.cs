using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly Random _rand;

        public ValuesController()
        {
            _rand = new Random();
        }

        // GET api/values/5
        [HttpGet("{count}")]
        public ActionResult<List<double>> GetRandomValues(int count)
        {
            var values = new List<double>();
            for (int i = 0; i < count; i++)
            {
                values.Add(_rand.Next(1000, 1000000) * _rand.NextDouble());
            }

            return values;
        }
    }
}
