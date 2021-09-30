// Copyright (c) 2020, Phoenix Contact GmbH & Co. KG
// Licensed under the Apache License, Version 2.0

#if USE_WCF
using System.IO;
using System.ServiceModel;
using System.ServiceModel.Web;
using Moryx.Communication.Endpoints;

namespace Moryx.Runtime.Maintenance.Web
{
    /// <summary>
    /// Service contract for the maintenance file system.
    /// </summary>
    [ServiceContract]
    [Endpoint(Name = nameof(IWebServerFileSystem), Version = "1.0.0")]
    internal interface IWebServerFileSystem
    {
        [OperationContract]
        [WebGet(UriTemplate = "*")]
        Stream Html();

        [OperationContract]
        [WebGet(UriTemplate = "bundle.js")]
        Stream BundleJs();

        [OperationContract]
        [WebGet(UriTemplate = "favicon.ico")]
        Stream FavIcon();
    }
}
#endif