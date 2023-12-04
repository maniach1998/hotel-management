import { ObjectId } from "mongodb";

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

export { checkString, checkId, checkNumber };
