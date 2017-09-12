CREATE TABLE SalesData
(
	[Sale_Id] INT NOT NULL,
    [Product_Id] VARCHAR(15) NOT NULL, 
    [Amount_Sold] INT NOT NULL, 
    [Date_Sold] DATE NOT NULL, 
    [Time_Sold] TIME NOT NULL, 
	PRIMARY KEY(Sale_Id),
    FOREIGN KEY (Product_Id) REFERENCES StockData(Product_Id)

)
