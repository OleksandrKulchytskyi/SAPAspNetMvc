define(['services/datacontext', 'durandal/plugins/router'],
function (datacontext, router) {
	var session = ko.observable(),
		rooms = ko.observableArray(),
		tracks = ko.observableArray(),
		timeSlots = ko.observableArray();

	var activate = function (routeData) {
		var id = parseInt(routeData.id);
		initLookups();
		return datacontext.getSessionById(id, session);
	};

	var initLookups = function () {
		rooms(datacontext.lookups.rooms);
		tracks(datacontext.lookups.tracks);
		timeSlots(datacontext.lookups.timeSlots);
	}

	var goBack = function () {
		router.navigateBack();
	};

	var vm = {
		activate: activate,
		goBack: goBack,
		session: session,
		title: 'Session details',
		rooms: rooms,
		timeSlots: timeSlots,
		tracks: tracks
	};
	return vm;

});