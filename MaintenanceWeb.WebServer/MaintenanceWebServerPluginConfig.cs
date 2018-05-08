using System.Runtime.Serialization;
using Marvin.Runtime.Maintenance.Contracts;
using Marvin.Tools.Wcf;

namespace MaintenanceWeb.WebServer
{
    [DataContract]
    public class MaintenanceWebServerPluginConfig : MaintenancePluginConfig
    {
        /// <summary>
        /// Constructor for web server config. Creates an endpoint with name "MaintenanceWeb".
        /// </summary>
        public MaintenanceWebServerPluginConfig()
        {
            ProvidedEndpoint = new HostConfig
            {
                Endpoint = "MaintenanceWeb",
            };
        }

        /// <summary>
        /// The name of the plugin.
        /// </summary>
        public override string PluginName => MaintenanceWebServerPlugin.PluginName;

    }
}
