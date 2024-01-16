import { v4 as uuidv4 } from "uuid";

/**
 * Generates a unique key
 *
 * @returns A unique key
 */
const generateUniqueKey = () => {
  return uuidv4();
};

export default generateUniqueKey;
