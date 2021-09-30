// Copyright (c) 2021, Phoenix Contact GmbH & Co. KG
// Licensed under the Apache License, Version 2.0

#if !USE_WCF
using Microsoft.AspNetCore.Mvc;

namespace Moryx.Runtime.Maintenance.Web
{
    /// <summary>
    /// Service contract for the maintenance file system.
    /// </summary>
    internal interface IWebServerFileSystem
    {
        IActionResult Html();
        IActionResult BundleJs();
        IActionResult FavIcon();
    }
}
#endif