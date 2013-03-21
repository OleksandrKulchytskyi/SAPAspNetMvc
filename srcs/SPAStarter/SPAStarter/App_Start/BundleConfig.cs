using System.Web.Optimization;

namespace SPAStarter
{
	public static class BundleConfig
	{
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
						"~/Scripts/jquery-1.*"));

			bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
						"~/Scripts/bootstrap.min.js"));

			bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
						"~/Scripts/modernizr-*"));

			bundles.Add(new StyleBundle("~/Content/css").Include(
						"~/Content/bootstrap-responsive.min.css",
						"~/Content/bootstrap.min.css",
						"~/Content/font-awesome.min.css",
						"~/Content/Site.css"));
		}
	}
}