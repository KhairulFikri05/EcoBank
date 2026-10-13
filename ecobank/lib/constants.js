// Konstanta bersama (dipakai UI dan API)
export const STATUS = {
  PENDING: "Pending",
  VERIFIED: "Verified",
  COMPLETED: "Completed",
};

export const STATUS_LIST = Object.values(STATUS);

// Urutan status: Pending -> Verified -> Completed
export const NEXT_STATUS = {
  [STATUS.PENDING]: STATUS.VERIFIED,
  [STATUS.VERIFIED]: STATUS.COMPLETED,
};

export const WASTE_TYPES = ["Plastik", "Kertas", "Kaca", "E-waste"];

export const ADMIN_HEADER = "x-admin-password";