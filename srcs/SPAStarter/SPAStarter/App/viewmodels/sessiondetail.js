define(['services/datacontext', 'durandal/plugins/router','derandal/app'],
function (datacontext, router,app) {
	var session = ko.observable(),
		rooms = ko.observableArray(),
		tracks = ko.observableArray(),
		timeSlots = ko.observableArray(),
		isSaving = ko.observable(false);

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

	var save = function () {
		isSaving(true);
		return datacontext.saveChanges().fin(complete);

		function complete() {
			isSaving(false);
		}
	};

	var cancel = function () {
		return datacontext.cancelChanges();
	};

	var hasChanges = ko.computed(function () {
		return datacontext.hasChanges();
	});

	var canSave = ko.computed(function () {
		return hasChanges() && !isSaving();
	});

	var canDeactivate = function () {
		if (hasChanges()) {
			var title = "Do you  wnat to leave '" + session().title + "'?";
			var msg = 'Navigate away and cancel your changes?';
			return app.showMessage(title, msg, ['Yes', 'No'])
					.then(confirmWorkflow);

			function confirmWorkflow(selectedOption) {
				if (selectedOption === 'Yes') {
					cancel();
				}
				return selectedOption;
			}
		}
		return true;
	};

	var vm = {
		activate: activate,
		goBack: goBack,
		save: save,
		canSave: canSave,
		cancel: cancel,
		session: session,
		hasChanges: hasChanges,
		canDeactivate: canDeactivate,
		title: 'Session details',
		rooms: rooms,
		timeSlots: timeSlots,
		tracks: tracks
	};
	return vm;

});