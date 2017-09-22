//Add additional text boxes
$(document).ready(function() {
	//Set tooltips
	$('[data-toggle="tooltip"]').tooltip();
	//handle modals on close
	$('#editModal').on('hidden.bs.modal',
		function() {
			var names = $('#editModal .modal-body input[type="text"]');
			var amounts = $('#editModal .modal-body input[type="number"]');
			for (count = 0; count < names.length; count++) {
				if (names[count]["value"] === "" && amounts[count]["value"] >= 1) {
					$(names[count]).parent().parent().remove();
				}
			}
		});
	$('#addReportModal').on('hidden.bs.modal',
		function () {
			//reset fields to default
			var names = $('#addReportModal .modal-body input[type="text"]');
			var amounts = $('#addReportModal .modal-body input[type="number"]');
			//reset modal data
			names[0]["value"] = "";
			amounts[0]["value"] = 1;
			for (count = 1; count < names.length; count++) {
				$(names[count]).parent().parent().remove();
			}

		});
	//Additional field code
	var max_fields = 10; //maximum input boxes allowed
	var wrapper = $(".modal-body"); //Fields wrapper
	var add_button = $(".addNewProduct"); //Add button ID

	var x = 1; //initlal text box count
	$(add_button).click(function(e) { //on add input button click
		e.preventDefault();
		if (x < max_fields) { //max input box allowed
			$(wrapper).append(
				'<div class="row"><div class="col-md-4"><label class="form-control-label" for="inputProductName">Product Name</label><input id="inputProductName"' +
				'data-bind=\'value: productName' +
				x +
				'\' class="form-control" type="text" name="productName"/></div><div class="col-md-4 move-left"><label class="form-control-label" for="inputAmountSold">Amount Sold</label><input id="inputAmountSold" class="amount form-control" type="number" name="amountSold" value="1" /></div><div class="col-md-2 move-left"><label class="form-control-label" for="inputPrice">Price</label><input id="inputPrice" class="price form-control" type="number" name="price" value="0.00" step="0.01"" /></div><div class="col-md-2"><button type="button" class="remove_field btn btn-danger glyphicon glyphicon-trash" style="margin-top:24px;"></div></div >'); //add input box
			x++; //text box increment
		}
	});
	$(wrapper).on("click", ".remove_field",
		function(e) { //user click on remove text
			e.preventDefault();
			$(this).parent().parent().remove();
			x--;
		});
});

	function SalesModel() {
		var self = this;
		self.salesRecords = ko.observableArray();
		self.ids = ko.observableArray();
		self.individualSale = ko.observableArray();
		self.grossSales = ko.observable();
		//Get data
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
						$('#salesIdholder').val(lastitemId + 1);
						console.log($('#salesIdholder').val());
					}
					total = 0;
					for (count = 0; count < self.salesRecords().length; count++) {
						total += self.salesRecords()[count].price;
					}
					self.grossSales(total.toFixed(2));
				});
		}
		//Deleting data
		self.deleteSalesId = function(id) {
			$.ajax({
				url: '/api/salesdata/' + id,
				type: 'DELETE',
				success: function(result) {
					self.getData();
				}
			});
		}
		//viewing data
		self.getDataFromId = function (id) {
			$.getJSON("api/salesdata/"+id,
				function (data) {
					self.individualSale(data);
					$('#currentId').val(id);
				});
			
		}
		self.getData();

		//Posting data
		self.saleData = ko.observableArray();
		self.addNewReport = function () {
			var json = ko.toJSON(self.saleData());
			$.ajax({
				url: "api/salesdata",
				type: "POST",
				data: json,
				contentType: "application/json; charset=utf-8",
				async: false,
				success: function (result) {
					self.saleData([]);
				}
			});
		};
		//Updating data
		self.updatedSalesData = ko.observableArray();
		self.ediSalesRecord = function (id) {
			var json = ko.toJSON(self.updatedSalesData());
			$.ajax({
				url: "api/salesdata/"+id,
				type: "PUT",
				data: json,
				contentType: "application/json; charset=utf-8",
				async: false,
				success: function (result) {
					self.updatedSalesData([]);
					console.log("Updated data");
				}
			});
		};
		postData = function () {
			var sales_id = $('#salesIdholder').val();
			var names = $('#addReportModal .modal-body input[type="text"]');
			var amounts = $('#addReportModal .amount ');
			var prices = $('#addReportModal .price');
			console.log(prices[0]["value"]);
			if (names.length >= 1) {
				for (count = 0; count < names.length; count++) {
					self.saleData.push({ sales_ID: +sales_id, product_name: names[count]["value"], amount_sold: amounts[count]["value"], price: prices[count]["value"], time_sold: new Date().toLocaleTimeString(), date_sold: new Date().toLocaleDateString() });

				}
			}
			self.addNewReport();
			self.getData();
		}
		updateData = function (id) {
			var sales_id = $('#currentId').val();
			var names = $('#editModal .modal-body input[type="text"]');
			var amounts = $('#editModal .modal-body input[type="number"]');
			var prices = $('#editModal .price');
			if (names.length >= 1) {
				for (count = 0; count < names.length; count++) {
					self.updatedSalesData.push({ sales_ID: +sales_id, product_name: names[count]["value"], amount_sold: amounts[0]["value"], price: prices[count]["value"]  });

				}
			}
			self.ediSalesRecord(sales_id);
			self.getData();
		}

	}

	ko.applyBindings(new SalesModel());
