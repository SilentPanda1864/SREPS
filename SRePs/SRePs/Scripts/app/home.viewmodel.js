﻿//Add additional text boxes
$(document).ready(function() {
	//Set popovers
	$('[data-toggle="tooltip"]').tooltip();
	//Additional field code
	var max_fields = 10; //maximum input boxes allowed
	var wrapper = $(".modal-body"); //Fields wrapper
	var add_button = $("#addNewProduct"); //Add button ID

	var x = 1; //initlal text box count
	$(add_button).click(function(e) { //on add input button click
		e.preventDefault();
		if (x < max_fields) { //max input box allowed
			$(wrapper).append(
				'<div class="row"><div class="col-md-6"><label class="form-control-label" for="inputProductName">Product Name</label><input id="inputProductName"' +
				'data-bind=\'value: productName' +
				x +
				'\' class="form-control" type="text" name="productName"/></div><div class="col-md-4 move-left"><label class="form-control-label" for="inputAmountSold">Amount Sold</label><input id="inputAmountSold" class="form-control" type="number" name="amountSold" value="1" /></div><div class="col-md-2"><button type="button" class="remove_field btn btn-danger glyphicon glyphicon-trash" style="margin-top:24px;"></div></div >'); //add input box
			x++; //text box increment
		}
	});
	$(wrapper).on("click", ".remove_field", function (e) { //user click on remove text
		e.preventDefault(); $(this).parent().parent().remove();
	})
});

	function SalesModel() {
		var self = this;
		//Getting data
		self.salesRecords = ko.observableArray();
		self.ids = ko.observableArray();
		self.individualSale = ko.observableArray();
		self.getData = function() {
			$.getJSON("api/salesdata",
				function (data) {
					self.salesRecords(data);
					var family = data, ids = [...new Set(family.map(a => a.sales_ID))];
					self.ids(ids);

					if (data.length == 0) {
						$('#salesIdholder').val(1);
					} else {
						var lastitemId = data[data.length - 1]["sales_ID"];
						$('#salesIdholder').val(lastitemId+1);
					}

				});
		}
		//viewing data
		self.getDataFromId = function (id) {
			$.getJSON("api/salesdata/"+id,
				function (data) {
					self.individualSale(data);
					console.log(self.individualSale());
				});
		}
		self.getData();

		//Posting data
		self.saleData = ko.observableArray();
		self.addNewReport = function () {
			var json = ko.toJSON(self.saleData());
			console.log(json);
			$.ajax({
				url: "api/salesdata",
				type: "POST",
				data: json,
				contentType: "application/json; charset=utf-8",
				async: false,
				success: function (result) {
					if (result.url) {
						location.href = result.url;
					}
				}
			});
		};
		buildArray = function () {
			var sales_id = $('#salesIdholder').val();
			var names = $('.modal-body input[type="text"]');
			var amounts = $('.modal-body input[type="number"]');
			if (names.length >= 1) {
				for (count = 0; count < names.length; count++) {
					self.saleData.push({ sales_ID: +sales_id, product_name: names[count]["value"], amount_sold: amounts[0]["value"] });

				}
			}
			self.addNewReport();
			self.getData();
			//TODO: update modal elements
		}

	}

	ko.applyBindings(new SalesModel());
