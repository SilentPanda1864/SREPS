//Add additional text boxes
$(document).ready(function () {
	var max_fields = 10; //maximum input boxes allowed
	var wrapper = $(".modal-body"); //Fields wrapper
	var add_button = $("#addNewProduct"); //Add button ID

	var x = 1; //initlal text box count
	$(add_button).click(function (e) { //on add input button click
		e.preventDefault();
		if (x < max_fields) { //max input box allowed
			x++; //text box increment
			$(wrapper).append('<div class="row"><div class="col-md-6"><label class="form-control-label" for="inputProductName">Product Name</label><input id="inputProductName" class="form-control" type="text" name="productName" value="" /></div><div class="col-md-6 move-left"><label class="form-control-label" for="inputAmountSold">Amount Sold</label><input id="inputAmountSold" class="form-control" type="number" name="amountSold" value="0" /></div></div >'); //add input box
		}
	});
});

function SalesModel() {
	var self = this;

	self.salesRecords = ko.observableArray();

	$.getJSON("/sales/all", function(data) {
			self.salesRecords(data);

	});

}
ko.applyBindings(new SalesModel());
