define(['config'], function (config) {
	var nulloDate = new Date(1900, 0, 1);
	var imageSettings = config.imageSettings;
	var referenceCheckValidator;
	var Validator = breeze.Validator;

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

	var createNullos = function (manager) {

		var unchanged = breeze.EntityState.Unchanged;

		createNullo(entityNames.timeSlot, { start: nulloDate, isSessionSlot: true });
		createNullo(entityNames.room);
		createNullo(entityNames.track);
		createNullo(entityNames.speaker, { firstName: '[Select a Person]' });

		function createNullo(entityName, values) {
			var initialValues = values || { name: '[Select a ' + entityName.toLowerCase() + ']' };
			return manager.createEntity(entityName, initialValues, unchanged);
		}
	};

	var model = {
		applySessionValidators: applySessionValidators,
		makeImageName: makeImageName,
		SpeakerPartial: SpeakerPartial,
		SessionPartial: SessionPartial,
		configureMetadataStore: configureMetadataStore,
		createNullos: createNullos,
		orderBy: orderBy,
		entityNames: entityNames
	};
	return model;

	function configureMetadataStore(metadataStore) {
		metadataStore.registerEntityTypeCtor(entityNames.session, function () { this.isPartial = false; }, sessionInitializer);
		metadataStore.registerEntityTypeCtor(entityNames.speaker, function () { this.isPartial = false; }, personInitializer);
		metadataStore.registerEntityTypeCtor(entityNames.timeSlot, null, timeSlotInitializer);

		referenceCheckValidator = createReferenceCheckValidator();
		Validator.register(referenceCheckValidator);
	}

	function createReferenceCheckValidator() {
		var name = 'realReferenceObject';
		var ctx = { messageTemplate: 'Missing %displayName% ' };
		var val = new Validator(name, valFun, ctx);
		//log('Validators created');
		return val;

		function valFun(value, context) {
			return value ? value.id() !== 0 : true;
		}
	}

	function applySessionValidators(metatdataStore) {
		var types = ['room', 'track', 'timeSlot', 'speaker'];
		types.forEach(addValidator);
		console.log('Validators applied.');
		function addValidator(propName) {
			var sesType = metatdataStore.getEntityType('Session');
			sesType.getProperty(propName)
			.validators.push(referenceCheckValidator);
		}
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
			var start = timeSlot.start();
			var value = ((start - nulloDate) === 0) ? '[Select a TimeSlot]' :
						(start && moment.utc(start).isValid()) ? moment.utc(start).format('ddd hh:mm a') : '[Unknown]';
			return value;
		});
	}
});