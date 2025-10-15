export const workshifts = [
  {
    "ShiftID": "SH-MORN-HCM",
    "Name": "Ca sáng",
    "BranchID": "BR-HCM",
    "Time": {
      "Start": "07:00",
      "End": "15:00"
    },
    "BreakMinutes": 30,
    "MaxEmployees": 8,
    "RolesRequired": [
      "Cashier",
      "Inventory"
    ],
    "Status": "Active",
    "CreateBy": "U1003",
    "CreatedAt": "2025-09-01T01:00:00Z",
    "UpdatedAt": "2025-10-01T01:00:00Z"
  },
  {
    "ShiftID": "SH-AFT-HCM",
    "Name": "Ca chiều",
    "BranchID": "BR-HCM",
    "Time": {
      "Start": "14:00",
      "End": "22:00"
    },
    "BreakMinutes": 30,
    "MaxEmployees": 8,
    "RolesRequired": [
      "Cashier",
      "Inventory"
    ],
    "Status": "Active",
    "CreateBy": "U1003",
    "CreatedAt": "2025-09-01T01:10:00Z",
    "UpdatedAt": "2025-10-01T01:10:00Z"
  },
  {
    "ShiftID": "SH-MORN-HN",
    "Name": "Ca sáng",
    "BranchID": "BR-HN",
    "Time": {
      "Start": "07:00",
      "End": "15:00"
    },
    "BreakMinutes": 30,
    "MaxEmployees": 6,
    "RolesRequired": [
      "Cashier"
    ],
    "Status": "Active",
    "CreateBy": "U9000",
    "CreatedAt": "2025-09-02T01:00:00Z",
    "UpdatedAt": "2025-09-30T23:00:00Z"
  },
  {
    "ShiftID": "SH-AFT-HN",
    "Name": "Ca chiều",
    "BranchID": "BR-HN",
    "Time": {
      "Start": "14:00",
      "End": "22:00"
    },
    "BreakMinutes": 30,
    "MaxEmployees": 6,
    "RolesRequired": [
      "Cashier",
      "Inventory"
    ],
    "Status": "Active",
    "CreateBy": "U1006",
    "CreatedAt": "2025-09-02T01:10:00Z",
    "UpdatedAt": "2025-10-01T00:10:00Z"
  },
  {
    "ShiftID": "SH-NIGHT-HCM",
    "Name": "Ca đêm",
    "BranchID": "BR-HCM",
    "Time": {
      "Start": "22:00",
      "End": "06:00"
    },
    "BreakMinutes": 20,
    "MaxEmployees": 4,
    "RolesRequired": [
      "Cashier"
    ],
    "Status": "Active",
    "CreateBy": "U1003",
    "CreatedAt": "2025-10-01T01:20:00Z",
    "UpdatedAt": "2025-10-01T01:20:00Z"
  }
]
export default workshifts;