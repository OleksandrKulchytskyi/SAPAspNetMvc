define(function myfunction() {
	toastr.options.timeOut = 4000;
	toastr.options.position = 'toast-bottom-right';

	var imageSettings = {
		imageBasePath: '../content/images/photos/',
		unknownPersonImageSource: 'unknown_person.jpg'
	};

	var remoteServiceName = 'api/breeze';

	var routes = [{
		url: 'speakers',
		moduleId: 'viewmodels/speakers',
		name: 'Speakers',
		visible: true
	},
	{
		url: 'sessions',
		moduleId: 'viewmodels/sessions',
		name: 'Sessions',
		visible: true
	}];

	var startModule = 'speakers';

	return {
		imageSettings: imageSettings,
		routes: routes,
		startModule: startModule,
		remoteServiceName: remoteServiceName
	};
});