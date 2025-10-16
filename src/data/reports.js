export const reports = [
  {
    "ReportID": "RPT-2025W41-SALES",
    "Type": "Sales",
    "Period": {
      "StartDate": "2025-10-06",
      "EndDate": "2025-10-12"
    },
    "BranchID": "BR-HCM",
    "Metrics": {
      "TotalSales": 1850000,
      "TotalProfit": 410000,
      "TotalOrders": 132,
      "TotalCustomers": 89,
      "TopProducts": [
        {
          "ProductID": "P1003",
          "ProductName": "Mì ly hải sản 70g",
          "QuantitySold": 95,
          "Revenue": 1330000
        },
        {
          "ProductID": "P1001",
          "ProductName": "Nước khoáng 500ml",
          "QuantitySold": 120,
          "Revenue": 720000
        }
      ],
      "StockValue": 1280000
    },
    "GeneratedBy": "U1003",
    "GeneratedAt": "2025-10-11T17:00:00Z",
    "Notes": "Tuần 41"
  },
  {
    "ReportID": "RPT-2025W41-INV",
    "Type": "Inventory",
    "Period": {
      "StartDate": "2025-10-06",
      "EndDate": "2025-10-12"
    },
    "BranchID": "BR-HCM",
    "Metrics": {
      "StockValue": 11340000,
      "OtherMetrics": [
        {
          "k": "low_stock",
          "v": [
            "P1004"
          ]
        }
      ]
    },
    "GeneratedBy": "U1002",
    "GeneratedAt": "2025-10-11T17:05:00Z",
    "Notes": ""
  },
  {
    "ReportID": "RPT-2025-09-SALES",
    "Type": "Sales",
    "Period": {
      "StartDate": "2025-09-01",
      "EndDate": "2025-09-30"
    },
    "BranchID": "BR-HCM",
    "Metrics": {
      "TotalSales": 22500000,
      "TotalProfit": 5200000,
      "TotalOrders": 980,
      "TopProducts": [],
      "StockValue": 12300000
    },
    "GeneratedBy": "U1003",
    "GeneratedAt": "2025-10-01T01:00:00Z",
    "Notes": "Tháng 9"
  },
  {
    "ReportID": "RPT-2025-09-INV",
    "Type": "Inventory",
    "Period": {
      "StartDate": "2025-09-01",
      "EndDate": "2025-09-30"
    },
    "BranchID": "BR-HN",
    "Metrics": {
      "StockValue": 6800000
    },
    "GeneratedBy": "U1004",
    "GeneratedAt": "2025-10-01T01:10:00Z",
    "Notes": ""
  },
  {
    "ReportID": "RPT-2025W40-SALES",
    "Type": "Sales",
    "Period": {
      "StartDate": "2025-09-29",
      "EndDate": "2025-10-05"
    },
    "BranchID": "BR-HN",
    "Metrics": {
      "TotalSales": 7500000,
      "TotalProfit": 1600000,
      "TotalOrders": 300,
      "TopProducts": [
        {
          "ProductID": "P1006",
          "ProductName": "Bánh quy bơ 180g",
          "QuantitySold": 140,
          "Revenue": 3920000
        }
      ],
      "StockValue": 2730000
    },
    "GeneratedBy": "U1004",
    "GeneratedAt": "2025-10-05T23:59:00Z",
    "Notes": ""
  },
  {
    "ReportID": "RPT-2025W41-HN-SALES",
    "Type": "Sales",
    "Period": {
      "StartDate": "2025-10-06",
      "EndDate": "2025-10-12"
    },
    "BranchID": "BR-HN",
    "Metrics": {
      "TotalSales": 5200000,
      "TotalProfit": 980000,
      "TotalOrders": 210,
      "TopProducts": [
        {
          "ProductID": "P1006",
          "ProductName": "Bánh quy bơ 180g",
          "QuantitySold": 120,
          "Revenue": 3360000
        },
        {
          "ProductID": "P1010",
          "ProductName": "Kẹo dẻo trái cây 100g",
          "QuantitySold": 60,
          "Revenue": 900000
        }
      ],
      "StockValue": 1540000
    },
    "GeneratedBy": "U1006",
    "GeneratedAt": "2025-10-11T18:00:00Z",
    "Notes": "HN tuần 41"
  },
  {
    "ReportID": "RPT-2025W40-INV-HCM",
    "Type": "Inventory",
    "Period": {
      "StartDate": "2025-09-29",
      "EndDate": "2025-10-05"
    },
    "BranchID": "BR-HCM",
    "Metrics": {
      "StockValue": 11000000
    },
    "GeneratedBy": "U1002",
    "GeneratedAt": "2025-10-05T18:00:00Z",
    "Notes": ""
  },
  {
    "ReportID": "RPT-2025Q3-SALES",
    "Type": "Sales",
    "Period": {
      "StartDate": "2025-07-01",
      "EndDate": "2025-09-30"
    },
    "BranchID": "BR-HCM",
    "Metrics": {
      "TotalSales": 76500000,
      "TotalProfit": 16900000,
      "TotalOrders": 3120,
      "TopProducts": [],
      "StockValue": 12300000
    },
    "GeneratedBy": "U1003",
    "GeneratedAt": "2025-10-01T02:00:00Z",
    "Notes": "Quý 3"
  },
  {
    "ReportID": "RPT-2025Q3-INV-HN",
    "Type": "Inventory",
    "Period": {
      "StartDate": "2025-07-01",
      "EndDate": "2025-09-30"
    },
    "BranchID": "BR-HN",
    "Metrics": {
      "StockValue": 7200000,
      "OtherMetrics": [
        {
          "k": "expiring",
          "v": [
            "P1008"
          ]
        }
      ]
    },
    "GeneratedBy": "U1006",
    "GeneratedAt": "2025-10-01T02:10:00Z",
    "Notes": ""
  },
  {
    "ReportID": "RPT-2025W39-SALES",
    "Type": "Sales",
    "Period": {
      "StartDate": "2025-09-22",
      "EndDate": "2025-09-28"
    },
    "BranchID": "BR-HCM",
    "Metrics": {
      "TotalSales": 6800000,
      "TotalProfit": 1450000,
      "TotalOrders": 265,
      "TopProducts": [],
      "StockValue": 11000000
    },
    "GeneratedBy": "U1003",
    "GeneratedAt": "2025-09-28T23:59:00Z",
    "Notes": ""
  }
]
export default reports;