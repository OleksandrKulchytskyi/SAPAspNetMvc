using Ninject;
using System.Web.Http.Dependencies;

namespace SPAStarter.IoC
{
	public class NinjectDependencyResolver : NinjectDependencyScope, IDependencyResolver
	{
		private IKernel kernel;

		public NinjectDependencyResolver(IKernel kernel)
			: base(kernel)
		{
			this.kernel = kernel;
		}

		public IDependencyScope BeginScope()
		{
			return new NinjectDependencyScope(kernel.BeginBlock());
		}
	}
}