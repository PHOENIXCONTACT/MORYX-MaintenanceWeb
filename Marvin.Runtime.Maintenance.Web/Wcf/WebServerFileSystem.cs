﻿using System.IO;
using System.Reflection;
using System.ServiceModel;
using System.ServiceModel.Web;
using Marvin.Container;

namespace Marvin.Runtime.Maintenance.Web
{
    /// <summary>
    /// Service for the file system. 
    /// </summary>
    [Plugin(LifeCycle.Transient, typeof(IWebServerFileSystem))]
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerSession, IncludeExceptionDetailInFaults = true)]
    internal class WebServerFileSystem : IWebServerFileSystem
    {
        private static readonly string AssemblyName;

        static WebServerFileSystem()
        {
            AssemblyName = Assembly.GetExecutingAssembly().GetName().Name;
        }

        public Stream Html()
        {
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
            return GetResourceByName($"{AssemblyName}.wwwroot.index.html");
        }

        public Stream BundleJs()
        {
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/javascript";
            return GetResourceByName($"{AssemblyName}.wwwroot.bundle.js");
        }

        private static Stream GetResourceByName(string resourceName)
        {
            return Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName);
        }
    }
}
