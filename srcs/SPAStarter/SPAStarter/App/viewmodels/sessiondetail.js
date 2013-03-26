define(['services/datacontext', 'durandal/plugins/router'],
function (datacontext, router) {
	var session = ko.observable();

	var activate = function (routeData) {
		var id = parseInt(routeData.id);
		return datacontext.getSessionById(id, session);
	};

	var goBack = function () {
		router.navigateBack();
	};

	var vm = {
		activate: activate,
		goBack: goBack,
		session: session,
		title: 'Session details'
	};
	return vm;

});