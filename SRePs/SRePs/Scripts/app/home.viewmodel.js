function SalesModel() {
	var self = this;

	self.salesRecords = ko.observableArray();

	$.getJSON("/sales/all", function(data) {
			self.salesRecords(data);

	});

}
ko.applyBindings(new SalesModel());
