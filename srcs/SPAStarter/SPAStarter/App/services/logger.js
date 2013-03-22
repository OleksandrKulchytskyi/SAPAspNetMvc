define(['durandal/system'],
	function (system) {

		var logger = {
			log: log,
			logError: logError
		};
		return logger;

		function log(messaage, data, source, showToast) {
			logIt(messaage, data, source, showToast, 'info');
		}

		function logError(messaage, data, source, showToast) {
			logIt(messaage, data, source, showToast, 'error');
		}

		function logIt(message, data, source, showToast, toastrType) {
			source = source ? '[' + source + ']' : "";
			if (data) {
				system.log(source, message, data);
			}
			else {
				system.log(source, message);
			}
			if (showToast) {
				if (toastrType === 'error') {
					toastr.error(message);
				} else {
					toastr.info(message);
				}
			}
		}
	});