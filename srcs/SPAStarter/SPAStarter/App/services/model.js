define(function () {

	var imageSettings = {
		imageBasePath: '../Content/images/photos/',
		unknownPersonImageSource: 'unknown_person.jpg'
	};

	var SpeakerPartial = function (dto) {
		return addSpeakerPartialCompleted(mapToObservable(dto));
	};

	var model = {
		SpeakerPartial: SpeakerPartial
	};
	return model;

	function mapToObservable(dto) {
		var mapped = {};
		for (prop in dto) {
			if (dto.hasOwnProperty(prop)) {
				mapped[prop] = ko.observable(dto[prop]);
			}
		}
		return mapped;
	}

	function addSpeakerPartialCompleted(entity) {

		entity.fullName = ko.computed(function () {
			return entity.firstName() + ' ' + entity.lastName();
		});

		entity.imageName = ko.computed(function () {
			return makeImageName(entity.imageSource());
		});
	}

	function makeImageName(source) {
		return (imageSettings.imageBasePath + (source || imageSettings.unknownPersonImageSource));
	}
});