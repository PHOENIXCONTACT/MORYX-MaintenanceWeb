﻿using System.IO;
using System.Reflection;
using System.ServiceModel;
using System.ServiceModel.Web;
using Marvin.Container;

namespace MaintenanceWeb.WebServer.WebServerService
{
    /// <summary>
    /// Service for the file system. 
    /// </summary>
    [Plugin(LifeCycle.Transient, typeof(IWebServerFileSystem))]
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerSession, IncludeExceptionDetailInFaults = true)]
    internal class WebServerFileSystem : IWebServerFileSystem
    {
        public Stream Html()
        {
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";

            return GetResourceByName("MaintenanceWeb.WebServer.wwwroot.index.html");
        }

        public Stream BundleJs()
        {
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/javascript";

            return GetResourceByName("MaintenanceWeb.WebServer.wwwroot.bundle.js");
        }

        private Stream GetResourceByName(string resourceName)
        {
            return Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName);
        }
    }
}
