define(['config'], function (config) {

	var imageSettings = config.imageSettings;

	var orderBy = {
		speaker: 'firstName,lastName',
		session: 'timeSlotId'
	};

	var entityNames = {
		speaker: 'Person',
		session: 'Session',
		room: 'Room',
		track: 'Track',
		timeSlot: 'TimeSlot'
	};

	var SessionPartial = function (dto) {
		return addSessionPartialComputeds(mapToObservable(dto));
	};

	var SpeakerPartial = function (dto) {
		return addSpeakerPartialCompleted(mapToObservable(dto));
	};

	var makeImageName = function (source) {
		return (imageSettings.imageBasePath + (source || imageSettings.unknownPersonImageSource));
	};


	var model = {
		makeImageName: makeImageName,
		SpeakerPartial: SpeakerPartial,
		SessionPartial: SessionPartial,
		configureMetadataStore: configureMetadataStore,
		orderBy: orderBy,
		entityNames: entityNames
	};
	return model;

	function configureMetadataStore(metadataStore) {
		metadataStore.registerEntityTypeCtor(entityNames.session, function () { this.isPartial = false; }, sessionInitializer);
		metadataStore.registerEntityTypeCtor(entityNames.speaker, function () { this.isPartial = false; }, personInitializer);
		metadataStore.registerEntityTypeCtor(entityNames.timeSlot, null, timeSlotInitializer);
	}

	function mapToObservable(dto) {
		var mapped = {};
		for (prop in dto) {
			if (dto.hasOwnProperty(prop)) {
				mapped[prop] = ko.observable(dto[prop]);
			}
		}
		return mapped;
	}

	function sessionInitializer(session) {
		session.tagsFormatted = ko.computed(function () {
			var text = session.tags();
			return text ? text.replace(/\|/g, ', ') : text;
		});
	}

	function personInitializer(person) {
		person.fullName = ko.computed(function () {
			return person.firstName() + ' ' + person.lastName();
		});

		person.imageName = ko.computed(function () {
			return makeImageName(person.imageSource());
		});
	}

	function timeSlotInitializer(timeSlot) {
		timeSlot.name = ko.computed(function () {
			return timeSlot.start() ? moment.utc(timeSlot.start()).format('ddd hh:mm a') : '';
		});
	}
});