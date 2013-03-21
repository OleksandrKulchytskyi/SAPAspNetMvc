using Ninject;
using SPAStarter.Contracts;
using SPAStarter.Data;
using SPAStarter.IoC;
using System.Web.Http;

namespace SPAStarter
{
	public class IocConfig
	{
		public static void RegisterIoc(HttpConfiguration config)
		{
			var kernel = new StandardKernel(); // Ninject IoC

			// These registrations are "per instance request".
			// See http://blog.bobcravens.com/2010/03/ninject-life-cycle-management-or-scoping/

			kernel.Bind<RepositoryFactories>().To<RepositoryFactories>().InSingletonScope();

			kernel.Bind<IRepositoryProvider>().To<RepositoryProvider>();
			kernel.Bind<ICodeCamperUow>().To<CodeCamperUow>();

			// Tell WebApi how to use our Ninject IoC
			config.DependencyResolver = new NinjectDependencyResolver(kernel);
		}
	}
}