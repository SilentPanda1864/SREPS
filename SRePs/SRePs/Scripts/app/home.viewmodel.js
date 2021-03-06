﻿//Add additional text boxes

$(document).ready(function() {
	//Set tooltips
	$('[data-toggle="tooltip"]').tooltip();
	$('#startDate').datepicker().on('changeDate', function(ev) {
		$(this).datepicker('hide');
		
		//updateFilteredData($('#startDate').val(),$('#endDate').val());
	});
	$('#endDate').datepicker().on('changeDate',
		function(ev) {
			$(this).datepicker('hide');
			//updateFilteredData($('#startDate').val(), $('#endDate').val());
		});
	//handle modals on close
	$('#editModal').on('hidden.bs.modal',
		function() {
			var names = $('#editModal .modal-body input[type="text"]');
			var amounts = $('#editModal .modal-body input[type="number"]');
			var prices = $('#editModal .price');
			for (count = 0; count < names.length; count++) {
				if (names[count]["value"] === "" && amounts[count]["value"] >= 1 && prices[count] >= 0) {
					$(names[count]).parent().parent().remove();
				}
			}
		});
	$('#addReportModal').on('hidden.bs.modal',
		function () {
			//reset fields to default
			var names = $('#addReportModal .modal-body input[type="text"]');
			var amounts = $('#addReportModal .modal-body input[type="number"]');
			var prices = $('#addReportModal .price');
			//reset modal data
			names[0]["value"] = "";
			amounts[0]["value"] = 1;
			prices[0]["value"] = 0.00;
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
			if ($('#addReportModal').is(':visible')) {
				$('#addReportModal .modal-body').append(
					'<div class="row"><div class="col-md-4"><label class="form-control-label" for="inputProductName">Product Name</label><input id="inputProductName"' +
					'data-bind=\'value: productName' +
					x +
					'\' class="form-control" type="text" name="productName"/></div><div class="col-md-4 move-left"><label class="form-control-label" for="inputAmountSold">Amount Sold</label><input id="inputAmountSold" class="amount form-control" type="number" name="amountSold" value="1" /></div><div class="col-md-2 move-left"><label class="form-control-label" for="inputPrice">Price</label><input id="inputPrice" class="price form-control" type="number" name="price" value="0.00" step="0.01"" /></div><div class="col-md-2"><button type="button" class="remove_field btn btn-danger glyphicon glyphicon-trash" style="margin-top:24px;"></div></div >'); //add input box
				x++; //text box increment
			} else if ($('#editModal').is(':visible')) {
				$('#editModal .modal-body').append(
					'<div class="row"><div class="col-md-4"><label class="form-control-label" for="inputProductName">Product Name</label><input id="inputProductName"' +
					'data-bind=\'value: productName' +
					x +
					'\' class="form-control" type="text" name="productName"/></div><div class="col-md-4 move-left"><label class="form-control-label" for="inputAmountSold">Amount Sold</label><input id="inputAmountSold" class="amount form-control" type="number" name="amountSold" value="1" /></div><div class="col-md-2 move-left"><label class="form-control-label" for="inputPrice">Price</label><input id="inputPrice" class="price form-control" type="number" name="price" value="0.00" step="0.01"" /></div><div class="col-md-2"><button type="button" class="remove_field btn btn-danger glyphicon glyphicon-trash" style="margin-top:24px;"></div></div >'); //add input box
				x++; //text box increment
			}
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
	self.filteredSales = ko.observableArray();
	self.startDate = ko.observable();
	self.endDate = ko.observable();
	self.checkData = function() {
		if (self.filteredSales().length > 0) {
			$("#modalSalesReports").modal("show");
		}
		console.log("called");
	}
	self.convertArrayOfObjectsToCSV = function(args) {
		var result, ctr, keys, columnDelimiter, lineDelimiter, data;

		data = args.data || null;
		if (data == null || !data.length) {
			return null;
		}

		columnDelimiter = args.columnDelimiter || ',';
		lineDelimiter = args.lineDelimiter || '\n';

		keys = Object.keys(data[0]);

		result = '';
		result += keys.join(columnDelimiter);
		result += lineDelimiter;

		data.forEach(function (item) {
			ctr = 0;
			keys.forEach(function (key) {
				if (ctr > 0) result += columnDelimiter;

				result += item[key];
				ctr++;
			});
			result += lineDelimiter;
		});

		return result;
	}
	self.downloadCSV = function(args) {
		var data, filename, link;
		var csv = self.convertArrayOfObjectsToCSV({
			data: self.filteredSales()
		});
		if (csv == null) return;

		filename = args.filename || 'export.csv';

		if (!csv.match(/^data:text\/csv/i)) {
			csv = 'data:text/csv;charset=utf-8,' + csv;
		}
		data = encodeURI(csv);

		link = document.createElement('a');
		link.setAttribute('href', data);
		link.setAttribute('download', filename);
		link.click();
	}


	self.startDate.subscribe(function(value) {
			self.updateFilteredData();

		});
		self.endDate.subscribe(function (value) {
			self.updateFilteredData();

		});
		self.updateFilteredData = function() {
			
			start = moment($('#startDate').val(), "DD/MM/YYYY");
			end = moment($('#endDate').val(), "DD/MM/YYYY");
			if (!start.isValid() || !end.isValid()) return;
			self.filteredSales([]);//Clear array so data doesnt compound.
			$.getJSON("api/salesdata",
				function(data) {
					for (i = 0; i < data.length; i++) {
						current = moment(data[i].date_Sold, "DD/MM/YYYY");
						if (current.isBetween(start, end, null, '[]')) {
							console.log(data[i]);
							self.filteredSales.push(data[i]);
						}
					}
					total = 0;
							for (count = 0; count < self.filteredSales().length; count++) {
								total += self.filteredSales()[count].price;
		
							}
					self.grossSales(total.toFixed(2));
				});
		}
		//Get data
		self.getData = function() {
			$.getJSON("api/salesdata",
				function(data) {
					self.salesRecords(data);
					var family = data, ids = [...new Set(family.map(a => a.sales_ID))];
					self.ids(ids);
					if (data.length == 0) {
						$('#salesIdholder').val(1);
					} else {
						var lastitemId = data[data.length - 1]["sales_ID"];
						$('#salesIdholder').val(lastitemId + 1);
					}
					//Added here for consistency
					total = 0;
					for (count = 0; count < self.filteredSales().length; count++) {
						total += self.filteredSales()[count].price;

					}
					self.grossSales(total.toFixed(2));
					
				});
		};

		//Deleting data
		self.deleteSalesId = function(id) {
			$.ajax({
				url: '/api/salesdata/' + id,
				type: 'DELETE',
				success: function(result) {
					self.getData();
				}
			});
		};
		//viewing data
		self.getDataFromId = function(id) {
			$.getJSON("api/salesdata/" + id,
				function(data) {
					self.individualSale(data);
					$('#currentId').val(id);
				});

		};
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
				}
			});
		};
		postData = function() {
			var sales_id = $('#salesIdholder').val();
			var names = $('#addReportModal .modal-body input[type="text"]');
			var amounts = $('#addReportModal .amount ');
			var prices = $('#addReportModal .price');
			if (names.length >= 1) {
				for (count = 0; count < names.length; count++) {
					self.saleData.push({
						sales_ID: +sales_id,
						product_name: names[count]["value"],
						amount_sold: amounts[count]["value"],
						price: prices[count]["value"],
						time_sold: new Date().toLocaleTimeString(),
						date_sold: moment().format("DD/MM/YYYY")
				});

				}
			}
			self.addNewReport();
			self.getData();
		};
		updateData = function(id) {
			var sales_id = $('#currentId').val();
			var names = $('#editModal .modal-body input[type="text"]');
			var amounts = $('#editModal .modal-body input[type="number"]');
			var prices = $('#editModal .price');
			if (names.length >= 1) {
				for (count = 0; count < names.length; count++) {
					self.updatedSalesData.push({
						sales_ID: +sales_id,
						product_name: names[count]["value"],
						amount_sold: amounts[0]["value"],
						price: prices[count]["value"]
					});

				}
			}
			self.ediSalesRecord(sales_id);
			self.getData();
		};

	}

	ko.applyBindings(new SalesModel());
