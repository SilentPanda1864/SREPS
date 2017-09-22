
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 09/22/2017 15:03:55
-- Generated from EDMX file: C:\Users\Ryan\Source\Repos\SREPS2\SRePs\SREPSDataAccess\SREPSDataAccess.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [SREPSDB];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------


-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[SalesData]', 'U') IS NOT NULL
    DROP TABLE [dbo].[SalesData];
GO
IF OBJECT_ID(N'[dbo].[StockData]', 'U') IS NOT NULL
    DROP TABLE [dbo].[StockData];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'SalesDatas'
CREATE TABLE [dbo].[SalesDatas] (
    [Sales_ID] int  NOT NULL,
    [Amount_Sold] int  NOT NULL,
    [Date_Sold] varchar(50)  NULL,
    [Time_Sold] varchar(50)  NULL,
    [Product_Name] varchar(50)  NOT NULL,
    [Price] decimal(18,0)  NOT NULL
);
GO

-- Creating table 'StockDatas'
CREATE TABLE [dbo].[StockDatas] (
    [Product_ID] int  NOT NULL,
    [Product_Name] varchar(30)  NULL,
    [Stock_Level] int  NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Sales_ID], [Product_Name] in table 'SalesDatas'
ALTER TABLE [dbo].[SalesDatas]
ADD CONSTRAINT [PK_SalesDatas]
    PRIMARY KEY CLUSTERED ([Sales_ID], [Product_Name] ASC);
GO

-- Creating primary key on [Product_ID] in table 'StockDatas'
ALTER TABLE [dbo].[StockDatas]
ADD CONSTRAINT [PK_StockDatas]
    PRIMARY KEY CLUSTERED ([Product_ID] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------