define(function () {
	var defaultExtension = { isPartial: true };

	var mapper = {
		mapDtosToEntities: mapDtosToEntities
	};
	return mapper;

	function mapDtosToEntities(manager, dtos, entityName, keyName, extendWith) {
		return dtos.map(dtoToEntityMapper);

		function dtoToEntityMapper(dto) {
			var keyValue = dto[keyName];
			var entity = manager.getEntityByKey(entityName, keyValue);
			if (!entity) {
				extendWith = $.extend({ }, extendWith || defaultExtension);
				extendWith[keyName] = keyValue;
				entity = manager.createEntity(entityName, extendWith);
			}
			mapToEntity(entity, dto);
			entity.entityAspect.setUnchanged();
			return entity;
		}

		function mapToEntity(entity, dto) {
			// entity is an object with observables, dto is json
			for (var prop in dto) {
				if (dto.hasOwnProperty(prop)) {
					entity[prop](dto[prop]);
				}
			}
			return entity;
		}
	}
});