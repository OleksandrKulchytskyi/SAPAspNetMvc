using System;
using System.Web.Optimization;

namespace SPAStarter
{
	public static class BundleConfig
	{
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.IgnoreList.Clear();
			AddDefaultIgnorePatterns(bundles.IgnoreList);
			AddLessConfig(bundles);

			bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
						"~/Scripts/jquery-1.9.1.min.js"));

			bundles.Add(new ScriptBundle("~/bundles/toastr").Include(
						"~/Scripts/toastr.min.js"));

			bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
						"~/Scripts/bootstrap.min.js"));

			bundles.Add(new ScriptBundle("~/bundles/vendors").Include(
						"~/Scripts/jquery-1.9.1.min.js",
						"~/Scripts/knockout-{version}.js",
						"~/Scripts/bootstrap.min.js",
						"~/Scripts/sammy-{version}.js",
						"~/Scripts/moment.min.js",
						"~/Scripts/q.js",
						"~/Scripts/breeze.*",
						"~/Scripts/toastr.min.js"));

			bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
						"~/Scripts/modernizr-*"));

			bundles.Add(new StyleBundle("~/Content/css").Include(
						"~/Content/bootstrap.min.css",
						"~/Content/bootstrap-responsive.min.css",
						"~/Content/toastr.min.css",
						"~/Content/font-awesome.min.css",
						"~/Content/ie10mobile.css",
						"~/Content/app.css"));
		}

		private static void AddDefaultIgnorePatterns(IgnoreList ignoreList)
		{
			if (ignoreList == null)
				throw new ArgumentNullException("ignoreList");

			ignoreList.Ignore("*.intellisense.js");
			ignoreList.Ignore("*-vsdoc.js");

			//ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
			//ignoreList.Ignore("*.min.js", OptimizationMode.WhenDisabled);
			//ignoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);
		}

		private static void AddLessConfig(BundleCollection bundles)
		{
			bundles.Add(new Bundle("~/Content/less",
									new LessTransform(), new CssMinify()).Include("~/Content/Style.less"));
		}
	}

	public class LessTransform : IBundleTransform
	{
		public void Process(BundleContext context, BundleResponse response)
		{
			response.Content = dotless.Core.Less.Parse(response.Content);
			response.ContentType = "text/css";
		}
	}
}