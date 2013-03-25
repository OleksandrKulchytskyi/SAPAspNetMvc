define(['durandal/system', 'services/logger', 'services/model', 'config'],
	function (system, logger, model, config) {

		var EntityQuery = breeze.EntityQuery,
			manager = configureBreezeManager();

		var getSpekears = function (speakersObservable) {

			var query = EntityQuery.from("Speakers").orderBy("firstName,lastName");
			return manager.executeQuery(query).
				then(querySuceeded).fail(onFail);

			function querySuceeded(data) {
				if (speakersObservable) {
					speakersObservable(data.result);
				}
				log("Speakers is retrieved", data, true);
			}
		};

		var getSessions = function (sessionsObservable) {

			var query = EntityQuery.from("Sessions").orderBy("timeSlot,speaker.firstName");
			return manager.executeQuery(query).
				then(querySuceeded).fail(onFail);

			function querySuceeded(data) {
				if (sessionsObservable) {
					sessionsObservable(data.result);
				}
				log("Sessions is retrieved", data, true);
			}
		};

		var primeData = function () {
			return Q.all([getLookups(), getSpekears()]);
		};

		var datacontext = {
			getSpeakers: getSpekears,
			getSessions: getSessions,
			primeData: primeData
		};
		return datacontext;

		function sortSpeakers(s1, s2) {
			return (s1.firstName + s1.lastName > s2.firstName + s2.lastName) ? 1 : -1;
		}

		function sortSessions(s1, s2) {
			if (s1.timeSlot === s2.timeSlot) {
				return (s1.speakerFirstName > s2.speakerFirstName) ? 1 : -1;
			} else {
				return (s1.timeSlot > s2.timeSlot) ? 1 : -1;
			}
		}

		function onFail(jqXHR, textStatus) {
			var msg = 'onFail(). Error getting data.' + textStatus;
			logger.log(msg, jqXHR, system.getModuleId(datacontext), true);
		}

		function configureBreezeManager() {
			breeze.NamingConvention.camelCase.setAsDefault();
			var mgr = new breeze.EntityManager(config.remoteServiceName);
			model.configureMetadataStore(mgr.metadataStore);
			return mgr;
		}

		function getLookups() {
			return EntityQuery.from('Lookups')
			.using(manager).execute().fail(onFail);
		}

		function log(msg, data, showToast) {
			logger.log(msg, data, system.getModuleId(datacontext), showToast);
		}
	});