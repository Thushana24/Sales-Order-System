-- Sales Order Management System Database

CREATE DATABASE SalesOrderDB;
GO

USE SalesOrderDB;
GO

-- Create Client Table
CREATE TABLE Client (
    ClientId INT PRIMARY KEY IDENTITY(1,1),
    ClientName NVARCHAR(200) NOT NULL,
    Address NVARCHAR(500),
    City NVARCHAR(100),
    PostalCode NVARCHAR(20),
    Country NVARCHAR(100)
);

-- Create Item Table
CREATE TABLE Item (
    ItemId INT PRIMARY KEY IDENTITY(1,1),
    ItemCode NVARCHAR(50) NOT NULL,
    Description NVARCHAR(200) NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL
);

-- Create SalesOrder Table
CREATE TABLE SalesOrder (
    SalesOrderId INT PRIMARY KEY IDENTITY(1,1),
    OrderNumber NVARCHAR(50) NOT NULL UNIQUE,
    OrderDate DATETIME NOT NULL DEFAULT GETDATE(),
    ClientId INT NOT NULL,
    DeliveryAddress NVARCHAR(500),
    DeliveryCity NVARCHAR(100),
    DeliveryPostalCode NVARCHAR(20),
    DeliveryCountry NVARCHAR(100),
    TotalExclAmount DECIMAL(18,2) NOT NULL,
    TotalTaxAmount DECIMAL(18,2) NOT NULL,
    TotalInclAmount DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (ClientId) REFERENCES Client(ClientId)
);

-- Create SalesOrderDetail Table
CREATE TABLE SalesOrderDetail (
    SalesOrderDetailId INT PRIMARY KEY IDENTITY(1,1),
    SalesOrderId INT NOT NULL,
    ItemId INT NOT NULL,
    Note NVARCHAR(500),
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    TaxRate DECIMAL(5,2) NOT NULL,
    ExclAmount DECIMAL(18,2) NOT NULL,
    TaxAmount DECIMAL(18,2) NOT NULL,
    InclAmount DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (SalesOrderId) REFERENCES SalesOrder(SalesOrderId) ON DELETE CASCADE,
    FOREIGN KEY (ItemId) REFERENCES Item(ItemId)
);

-- Insert Sample Data
INSERT INTO Client (ClientName, Address, City, PostalCode, Country) VALUES
('ABC Corporation', '123 Main Street', 'New York', '10001', 'USA'),
('XYZ Ltd', '456 Park Avenue', 'London', 'SW1A 1AA', 'UK'),
('Global Trading Co', '789 Business Blvd', 'Sydney', '2000', 'Australia'),
('Tech Solutions Inc', '321 Innovation Drive', 'San Francisco', '94102', 'USA'),
('Metro Enterprises', '654 Commerce Road', 'Toronto', 'M5H 2N2', 'Canada');

INSERT INTO Item (ItemCode, Description, UnitPrice) VALUES
('ITEM001', 'Laptop Computer', 1200.00),
('ITEM002', 'Wireless Mouse', 25.00),
('ITEM003', 'USB Keyboard', 45.00),
('ITEM004', 'Monitor 24 inch', 300.00),
('ITEM005', 'HDMI Cable', 15.00),
('ITEM006', 'Desk Chair', 250.00),
('ITEM007', 'Desk Lamp', 35.00),
('ITEM008', 'Webcam HD', 80.00),
('ITEM009', 'External Hard Drive 1TB', 65.00),
('ITEM010', 'Printer All-in-One', 180.00);

PRINT 'Database setup completed successfully!';