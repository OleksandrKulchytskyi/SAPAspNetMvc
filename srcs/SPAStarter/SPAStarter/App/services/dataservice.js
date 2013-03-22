define(['durandal/system', 'services/logger', 'services/model'],
	function (system, logger, model) {

		var getSpekearsPartials = function (speakersObservable) {
			speakersObservable([]);

			var opt = {
				url: '/api/speakers',
				type: 'GET',
				dataType: 'json'
			}

			return $.ajax(opt)
					.then(querySuceeded)
					.fail(onFail);

			function querySuceeded(data) {

				var speakers = [];
				data.sort(sortSpeakers);
				data.forEach(function (item) {
					var s = new model.SpeakerPartial(item);
					speakers.push(s);
				});
				speakersObservable(speakers);
				log("Speakers is retrieved", speakers, true);
			}
		};

		var dataservice = {
			getSpeakersPartials: getSpekearsPartials
		};

		return dataservice;


		function sortSpeakers(s1, s2) {
			return (s1.firstName + s1.lastName > s2.firstName + s2.lastName) ? 1 : -1;
		}

		function onFail(jqXHR, textStatus) {
			var msg = 'Error getting data.' + textStatus;
			logger.log(msg, jqXHR, system.getModuleId(dataservice), true);
		}

		function log(msg, data, showToast) {
			logger.log(msg, data, system.getModuleId(dataservice), showToast);
		}
	});