using MaintenanceWeb.WebServer.WebServerService;
using Marvin.Container;
using Marvin.Modules;
using Marvin.Runtime.Maintenance.Contracts;
using Marvin.Runtime.Maintenance.Plugins;

namespace MaintenanceWeb.WebServer
{
    [ExpectedConfig(typeof(MaintenanceWebServerPluginConfig))]
    [Plugin(LifeCycle.Singleton, typeof(IMaintenancePlugin), Name = PluginName)]
    [DependencyRegistration(typeof(IWebServerFileSystem))]
    internal class MaintenanceWebServerPlugin : MaintenancePluginBase<MaintenanceWebServerPluginConfig, IWebServerFileSystem>
    {
        public const string PluginName = "MaintenanceWebServerModule";
    }
}