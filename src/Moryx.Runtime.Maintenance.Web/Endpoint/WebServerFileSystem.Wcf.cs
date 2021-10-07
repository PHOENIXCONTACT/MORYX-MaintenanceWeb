// Copyright (c) 2021, Phoenix Contact GmbH & Co. KG
// Licensed under the Apache License, Version 2.0

#if USE_WCF
using System.IO;
using System.Reflection;
using Moryx.Container;
using System.ServiceModel;
using System.ServiceModel.Web;

namespace Moryx.Runtime.Maintenance.Web
{
    /// <summary>
    /// Endpoint for the maintenance file system.
    /// </summary>
    [Plugin(LifeCycle.Transient, typeof(IWebServerFileSystem))]
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerSession, IncludeExceptionDetailInFaults = true)]
    internal class WebServerFileSystem : IWebServerFileSystem
    {
        internal const string Endpoint = "MaintenanceWeb";

        private static readonly string AssemblyName;

        static WebServerFileSystem()
        {
            AssemblyName = Assembly.GetExecutingAssembly().GetName().Name;
        }

        /// <inheritdoc />
        public Stream Html()
        {
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
            return GetResourceByName($"{AssemblyName}.wwwroot.index.html");
        }

        /// <inheritdoc />
        public Stream BundleJs()
        {
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/javascript";
            return GetResourceByName($"{AssemblyName}.wwwroot.bundle.js");
        }

        /// <inheritdoc />
        public Stream FavIcon()
        {
            WebOperationContext.Current.OutgoingResponse.ContentType = "image/x-icon";
            return GetResourceByName($"{AssemblyName}.wwwroot.favicon.ico");
        }

        private static Stream GetResourceByName(string resourceName)
        {
            return Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName);
        }
    }
}
#endif