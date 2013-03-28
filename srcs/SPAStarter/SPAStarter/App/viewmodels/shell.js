define(['durandal/system', 'services/logger', 'durandal/plugins/router', 'config', 'services/datacontext'],
function (system, logger, router, config, datacontext) {

	var activate = function () {
		datacontext.primeData()
		.then(boot).fail(failInitialization);

		function failInitialization(error) {
			console.log(error);
			var msg = "Application failed :" + error.message;
			logger.logError(msg, error, system.getModuleId(shell), true);
		}

		function boot() {
			logger.log("SPAStarter is started.", null, system.getModuleId(shell), true);
			router.map(config.routes);
			return router.activate(config.startModule);
		}
	};

	var adminRoutes = ko.computed(function () {
		return router.allRoutes().filter(function (r) {
			return r.settings.admin;
		});
	});

	var shell = {
		activate: activate,
		router: router,
		adminRoutes: adminRoutes,
		addSession: addSession
	};
	return shell;

	function addSession(item) {
		router.navigateTo(item.hash);
	}
});