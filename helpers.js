import { ObjectId } from "mongodb";
let checkin = null;

function checkString(value, name) {
  if (!value || typeof value !== "string")
    throw new Error(`\`${name}\` must be a non-empty string!`);

  value = value.trim();
  if (value.length === 0)
    throw new Error(`\`${name}\` cannot be empty string or just spaces!`);

  return value;
}

function checkId(id, name) {
  if (!id || typeof id !== "string")
    throw new Error(`\`${name}\` must be a non-empty string!`);

  id = id.trim();
  if (id.length === 0)
    throw new Error(`\`${name}\` cannot be empty string or just spaces!`);
  if (!ObjectId.isValid(id))
    throw new Error(`\`${name}\` is not a valid ObjectId!`);

  return id;
}

function checkNumber(value, name) {
  value = value.trim();
  if (value.length === 0)
    throw new Error(`\`${name}\` cannot be empty or just spaces!`);
  value = Number(value);
  if (!value || value == NaN)
    throw new Error(`\`${name}\` must be a non-empty Number!`);

  value = value.trim();
  if (value.length === 0)
    throw new Error(`\`${name}\` cannot be empty string or just spaces!`);

  return value;
}
function checkCheckin(value, name) {
  if (value == null) throw "All fields need to have valid values 7";
  if (typeof value !== "string") throw "value must be a string";
  if (value.trim().length === 0)
    throw "value cannot be an empty string or string with just spaces";
  let dobParts = value.split("/");
  let month = parseFloat(dobParts[0]);
  let day = parseFloat(dobParts[1]);
  if (
    (month === 1 && day < 32) ||
    (month === 2 && day < 29) ||
    (month === 3 && day < 32) ||
    (month === 4 && day < 31) ||
    (month === 5 && day < 32) ||
    (month === 6 && day < 31) ||
    (month === 7 && day < 32) ||
    (month === 8 && day < 32) ||
    (month === 9 && day < 31) ||
    (month === 10 && day < 32) ||
    (month === 11 && day < 31) ||
    (month === 12 && day < 32)
  ) {
  } else throw "ERROR: Enter a valid checkin date";

  const currentDate = new Date();

  let dob = new Date(dobParts[2], dobParts[0] - 1, dobParts[1]);

  if (currentDate > dob) throw "checkin date Cannot be in the past";

  checkin = dob;
}
function checkCheckout(value, name) {
  if (value == null) throw "All fields need to have valid values 7";
  if (typeof value !== "string") throw "value must be a string";
  if (value.trim().length === 0)
    throw "Checkout Date cannot be an empty string or string with just spaces";
  let dobParts = value.split("/");
  let month = parseFloat(dobParts[0]);
  let day = parseFloat(dobParts[1]);
  if (
    (month === 1 && day < 32) ||
    (month === 2 && day < 29) ||
    (month === 3 && day < 32) ||
    (month === 4 && day < 31) ||
    (month === 5 && day < 32) ||
    (month === 6 && day < 31) ||
    (month === 7 && day < 32) ||
    (month === 8 && day < 32) ||
    (month === 9 && day < 31) ||
    (month === 10 && day < 32) ||
    (month === 11 && day < 31) ||
    (month === 12 && day < 32)
  ) {
  } else throw "ERROR: Enter a valid Checkout date";

  const currentDate = new Date();

  let dob = new Date(dobParts[2], dobParts[0] - 1, dobParts[1]);

  if (currentDate > dob) throw "Checkout date Has to be in Future";
  if (checkin > dob) throw "Checkout date Has to be after the Checkin Date";
}

export { checkString, checkId, checkNumber, checkCheckin, checkCheckout };
