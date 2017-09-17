$(function () {
	app.initialize();

	// Activate 

	ko.validation.init({ grouping: { observable: false } });
	ko.applyBindings(app);
});
