define(function () {

	var imageSettings = {
		imageBasePath: '../Content/images/photos/',
		unknownPersonImageSource: 'unknown_person.jpg'
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
		configureMetadataStore: configureMetadataStore
	};
	return model;

	function configureMetadataStore(metadataStore) {
		metadataStore.registerEntityTypeCtor('Session', null, sessionInitializer);
		metadataStore.registerEntityTypeCtor('Person', null, personInitializer);
		metadataStore.registerEntityTypeCtor('TimeSlot', null, timeSlotInitializer);
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