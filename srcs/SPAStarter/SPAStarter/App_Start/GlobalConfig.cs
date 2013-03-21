using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace SPAStarter
{
	public static class GlobalConfig
	{
		public static void CustomizeConfig(HttpConfiguration config)
		{
			// Remove Xml formatters. This means when we visit an endpoint from a browser,
			// Instead of returning Xml, it will return Json.
			// More information from Dave Ward: http://jpapa.me/P4vdx6
			config.Formatters.Remove(config.Formatters.XmlFormatter);

			// Configure json camelCasing per the following post: http://jpapa.me/NqC2HH
			// Here we configure it to write JSON property names with camel casing
			// without changing our server-side data model:
			var json = config.Formatters.JsonFormatter;
			json.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

			// Add model validation, globally
			config.Filters.Add(new ValidationActionFilter());
		}
	}

	public class ValidationActionFilter : ActionFilterAttribute
	{
		public override void OnActionExecuting(HttpActionContext context)
		{
			var modelState = context.ModelState;
			if (!modelState.IsValid)
			{
				var errors = new JObject();
				foreach (var key in modelState.Keys)
				{
					var state = modelState[key];
					if (state.Errors.Any())
					{
						errors[key] = state.Errors.First().ErrorMessage;
					}
				}

				context.Response = context.Request.CreateResponse<JObject>(System.Net.HttpStatusCode.BadRequest, errors);
			}
		}
	}
}