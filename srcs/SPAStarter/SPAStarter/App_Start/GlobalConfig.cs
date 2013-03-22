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
			config.Formatters.Remove(config.Formatters.XmlFormatter);

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