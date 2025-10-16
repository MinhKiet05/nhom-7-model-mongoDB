export const promotions =  [
  {
    "PromotionID": "PRM1001",
    "PromotionName": "Giảm 10% Trà đóng chai",
    "Description": "Giảm 10% cho P1002",
    "DiscountType": "Percentage",
    "DiscountValue": 10,
    "MinPurchaseAmount": 0,
    "StartDate": "2025-10-01",
    "EndDate": "2025-10-31",
    "ApplicableProducts": [
      "P1002"
    ],
    "ApplicableCategories": [],
    "CustomerType": "All",
    "MaxUsagePerCustomer": 5,
    "TotalUsageLimit": 5000,
    "IsActive": true,
    "CreatedBy": "U1003",
    "CreatedAt": "2025-09-28",
    "UpdatedAt": "2025-10-01"
  },
  {
    "PromotionID": "PRM1002",
    "PromotionName": "Combo mì ly + nước khoáng",
    "Description": "Mua P1003 kèm P1001 giảm 5,000đ",
    "DiscountType": "FixedAmount",
    "DiscountValue": 5000,
    "MinPurchaseAmount": 0,
    "StartDate": "2025-10-05",
    "EndDate": "2025-11-05",
    "ApplicableProducts": [
      "P1003",
      "P1001"
    ],
    "ApplicableCategories": [],
    "CustomerType": "All",
    "MaxUsagePerCustomer": 3,
    "TotalUsageLimit": 2000,
    "IsActive": true,
    "CreatedBy": "U1003",
    "CreatedAt": "2025-10-03",
    "UpdatedAt": "2025-10-05"
  },
  {
    "PromotionID": "PRM1003",
    "PromotionName": "VIP -5% toàn giỏ",
    "Description": "Khách VIP giảm 5% toàn đơn từ 200k",
    "DiscountType": "Percentage",
    "DiscountValue": 5,
    "MinPurchaseAmount": 200000,
    "StartDate": "2025-09-01",
    "EndDate": "2025-12-31",
    "ApplicableProducts": [],
    "ApplicableCategories": [],
    "CustomerType": "VIP",
    "MaxUsagePerCustomer": 50,
    "TotalUsageLimit": 100000,
    "IsActive": true,
    "CreatedBy": "U1003",
    "CreatedAt": "2025-09-01",
    "UpdatedAt": "2025-10-01"
  },
  {
    "PromotionID": "PRM1004",
    "PromotionName": "Giảm 15% Bánh quy",
    "Description": "Giảm 15% cho P1006 trong tuần 41",
    "DiscountType": "Percentage",
    "DiscountValue": 15,
    "MinPurchaseAmount": 0,
    "StartDate": "2025-10-06",
    "EndDate": "2025-10-12",
    "ApplicableProducts": [
      "P1006"
    ],
    "ApplicableCategories": [],
    "CustomerType": "All",
    "MaxUsagePerCustomer": 10,
    "TotalUsageLimit": 3000,
    "IsActive": true,
    "CreatedBy": "U1006",
    "CreatedAt": "2025-10-05",
    "UpdatedAt": "2025-10-06"
  },
  {
    "PromotionID": "PRM1005",
    "PromotionName": "Buy 2 Get 1 Candy",
    "Description": "Mua 2 gói P1010 tặng 1",
    "DiscountType": "FreeItem",
    "DiscountValue": 1,
    "MinPurchaseAmount": 0,
    "StartDate": "2025-10-10",
    "EndDate": "2025-11-10",
    "ApplicableProducts": [
      "P1010"
    ],
    "ApplicableCategories": [
      "Bánh kẹo"
    ],
    "CustomerType": "All",
    "MaxUsagePerCustomer": 6,
    "TotalUsageLimit": 5000,
    "IsActive": true,
    "CreatedBy": "U1004",
    "CreatedAt": "2025-10-10",
    "UpdatedAt": "2025-10-10"
  },
  {
    "PromotionID": "PRM1006",
    "PromotionName": "Premium -3% toàn giỏ",
    "Description": "Premium giảm 3% đơn từ 150k",
    "DiscountType": "Percentage",
    "DiscountValue": 3,
    "MinPurchaseAmount": 150000,
    "StartDate": "2025-10-01",
    "EndDate": "2025-12-31",
    "ApplicableProducts": [],
    "ApplicableCategories": [],
    "CustomerType": "Premium",
    "MaxUsagePerCustomer": 50,
    "TotalUsageLimit": 80000,
    "IsActive": true,
    "CreatedBy": "U1003",
    "CreatedAt": "2025-10-01",
    "UpdatedAt": "2025-10-01"
  }
]
export default promotions;