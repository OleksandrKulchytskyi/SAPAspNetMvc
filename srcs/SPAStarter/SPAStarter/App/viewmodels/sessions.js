define(['services/datacontext', 'durandal/plugins/router'],
function (datacontext, router) {
	var sessions = ko.observableArray();

	var activate = function () {
		return datacontext.getSessionPartials(sessions);
	};

	var deactivate = function () {
		sessions([]);
	};

	var refresh = function () {
		console.log('refreshing');
		return datacontext.getSessionPartials(sessions, true);
	};

	var viewAttached = function (view) {
		bindEventList(view, '.session-brief', goToDetalis);
	};

	var goToDetails = function (selectedSession) {
		if (selectedSession && selectedSession.id()) {
			var url = '#/sessiondetail/' + selectedSession.id();
			router.navigateTo(url);
		}
	};

	var bindEventList = function (rootSelector, selector, callback, eventName) {
		var eName = eventName || 'click';
		$(rootSelector).on(eName, selector, function () {
			var session = ko.dataFor(this);
			callback(session);
			return false;
		});
	};

	var vm = {
		activate: activate,
		deactivate: deactivate,
		sessions: sessions,
		title: 'Sessions',
		viewAttached: viewAttached,
		refresh: refresh
	};
	return vm;
});