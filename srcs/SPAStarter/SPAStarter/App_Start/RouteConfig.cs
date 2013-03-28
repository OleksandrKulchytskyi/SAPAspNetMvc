using System.Web.Http;
using System.Web.Routing;

namespace SPAStarter
{
	public static class RouteConfig
	{
		public static string ControllerOnly = "ApiControllerOnly";
		public static string ControllerAndId = "ApiControllerAndIntegerId";
		public static string ControllerAction = "ApiControllerAction";

		public static void RegisterRoutes(RouteCollection routes)
		{
			//routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

			// This controller-per-type route is ideal for GetAll calls.
			// It finds the method on the controller using WebAPI conventions
			// The template has no parameters.
			routes.MapHttpRoute(
				name: ControllerOnly,
				routeTemplate: "api/{controller}"
			);

			routes.MapHttpRoute(
				name: ControllerAndId,
				routeTemplate: "api/{controller}/{id}",
				defaults: null, //defaults: new { id = RouteParameter.Optional } //,
				constraints: new { id = @"^\d+$" } // id must be all digits
			);

			// ex: api/lookups/all
			// ex: api/lookups/rooms
			routes.MapHttpRoute(
				name: ControllerAction,
				routeTemplate: "api/{controller}/{action}"
			);

			//PAPA: Commented this out because we wont be using MVC views
			//routes.MapRoute(
			//    name: "Default",
			//    url: "{controller}/{action}/{id}",
			//    defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
			//);
		}
	}
}