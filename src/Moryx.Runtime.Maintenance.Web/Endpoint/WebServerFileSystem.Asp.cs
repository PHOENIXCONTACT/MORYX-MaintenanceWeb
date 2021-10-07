// Copyright (c) 2021, Phoenix Contact GmbH & Co. KG
// Licensed under the Apache License, Version 2.0

#if !USE_WCF
using System.IO;
using System.Reflection;
using Moryx.Container;
using Microsoft.AspNetCore.Mvc;
using Moryx.Communication.Endpoints;

namespace Moryx.Runtime.Maintenance.Web
{
    /// <summary>
    /// Endpoint for the maintenance file system.
    /// </summary>
    [Plugin(LifeCycle.Transient, typeof(IWebServerFileSystem))]
    [ApiController, Route(Endpoint), Produces("application/json")]
    [Endpoint(Name = nameof(IWebServerFileSystem), Version = "1.0.0")]
    internal class WebServerFileSystem : Controller, IWebServerFileSystem
    {
        internal const string Endpoint = "MaintenanceWeb";

        private static readonly string AssemblyName;

        static WebServerFileSystem()
        {
            AssemblyName = Assembly.GetExecutingAssembly().GetName().Name;
        }

        [HttpGet]
        public IActionResult Html()
        {
            var fs = GetResourceByName($"{AssemblyName}.wwwroot.index.html");
            return File(fs, "text/html");
        }

        [HttpGet("bundle.js")]
        public IActionResult BundleJs()
        {
            var fs = GetResourceByName($"{AssemblyName}.wwwroot.bundle.js");
            return File(fs, "text/javascript");
        }

        [HttpGet("favicon.ico")]
        public IActionResult FavIcon()
        {
            var fs = GetResourceByName($"{AssemblyName}.wwwroot.favicon.ico");
            return File(fs, "image/x-icon");
        }

        private static Stream GetResourceByName(string resourceName)
        {
            return Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName);
        }
    }
}
#endif