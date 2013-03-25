define(['durandal/system', 'services/logger', 'durandal/plugins/router', 'config', 'services/datacontext'],
function (system, logger, router, config, datacontext) {

	var shell = {
		activate: activate,
		router: router
	};
	return shell;

	function activate() {
		datacontext.primeData()
			.then(boot)
		.fail(failInitialization);
	}

	function failInitialization(error) {
		var msg = "Application failed :" + error.message;
		logger.logError(msg, error, system.getModuleId(shell), true);
	}

	function boot() {
		logger.log("SPAStarter is started!", null, system.getModuleId(shell), true);
		router.map(config.routes);
		return router.activate(config.startModule);
	}
});