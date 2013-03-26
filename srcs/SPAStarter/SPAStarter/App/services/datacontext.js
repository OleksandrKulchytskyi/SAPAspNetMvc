define(['durandal/system', 'services/logger', 'services/model', 'config', 'services/breeze.partial-entities'],
	function (system, logger, model, config, mapper) {

		var EntityQuery = breeze.EntityQuery,
			manager = configureBreezeManager();

		var entityNames = model.entityNames;

		var getSpeakerPartials = function (speakersObservable, forceRemote) {

			if (!forceRemote) {
				var p = getLocal(entityNames.speaker, model.orderBy.speaker);
				if (p.length > 3) {
					//edge case
					speakersObservable(p);
					return Q.resolve();
				}
			}

			var query = EntityQuery.from("Speakers")
				.select('id,firstName,lastName,imageSource').orderBy('firstName,lastName');
			return manager.executeQuery(query).
				then(querySuceeded).fail(onFail);

			function querySuceeded(data) {
				console.log(data);
				var list = mapper.mapDtosToEntities(manager, data.results, entityNames.speaker, 'id');
				if (speakersObservable) {
					speakersObservable(list);
				}
				log("Speakers is retrieved", data, true);
			}
		};

		var getSessionPartials = function (sessionsObservable, forceRemote) {

			if (!forceRemote) {
				var p = getLocal(entityNames.session, model.orderBy.session);
				if (p.length > 3) {
					//edge case
					sessionsObservable(p);
					return Q.resolve();
				}
			}

			var query = EntityQuery.from("Sessions")
				.select('id,title,code,speakerId,trackId,roomId').orderBy("code");
			return manager.executeQuery(query).
				then(querySuceeded).fail(onFail);

			function querySuceeded(data) {
				var list = mapper.mapDtosToEntities(manager, data.results, entityNames.session, 'id');
				if (sessionsObservable) {
					sessionsObservable(list);
				}
				log("Sessions is retrieved", data, true);
			}
		};

		var getSessionById = function (sessionId, sessionObservable) {
			return manager.fetchEntityByKey(entityNames.session, sessionId, true)
							.then(fetchSucceeded)
							.fail(onFail);

			function fetchSucceeded(data) {
				var s = data.entity;
				return s.isPartial() ? refreshSession(s) : sessionObservable(s);
			}

			function refreshSession(session) {
				return EntityQuery.fromEntities(session).using(manager).execute()
				.then(querySucceeded).fail(onFail);
			}

			function querySucceeded(data) {
				var s = data.results[0];
				s.isPartial = false;
				log("Retrieved [Session] from remote data source", s, true);
				return sessionObservable(s);
			}
		};

		var primeData = function () {
			return Q.all([getLookups(),
				getSpeakerPartials(null, true)]);
		};

		var datacontext = {
			getSpeakerPartials: getSpeakerPartials,
			getSessionPartials: getSessionPartials,
			getSessionById: getSessionById,
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
			console.log(jqXHR);
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

		function getLocal(resource, ordering) {
			var query = EntityQuery.from(resource).orderBy(ordering);
			return manager.executeQueryLocally(query);
		}
	});