// src/utils/helpers/queryHelpers.ts

import ValidationError from "../../utils/exceptions/ValidationError";

export interface KeyValuePair {
  key: string;
  value: string | string[];
}

/**
 * Extracts key-value pairs from a given parameter string.
 * @param params The parameter string to be processed.
 * @returns An array of key-value pairs.
 */
export function extractParamsAttribute(params: string): KeyValuePair[] {
  try {
    // Parse the JSON string
    const parsedParams = JSON.parse(params);

    // Check if parsedParams is an array
    if (!Array.isArray(parsedParams)) {
      throw new ValidationError("Invalid format query params: expected an array");
    }

    // Map the parsed array to key-value objects
    return parsedParams.map((item: { [key: string]: string | string[] }) => {
      const [key, value] = Object.entries(item)[0];

      // Handle potential undefined values and ensure value is an array or a string
      return {
        key: key.trim(),
        value: Array.isArray(value) ? value.map((v) => v.trim()) : value.trim(),
      };
    });
  } catch (error) {
    console.error("Error parsing params attribute:", error);
    throw new ValidationError(`Error parsing params attribute: ${error}`);
  }
}

interface BetweenQuery {
  key: string;
  value: [string, string];
}

/**
 * Parses a between query string into an array of key-value pairs.
 * @param betweenParam The between query string in JSON format.
 * @returns An array of BetweenQuery objects.
 */
export function parseBetweenQuery(betweenParam: string): BetweenQuery[] {
  try {
    const betweenArray = JSON.parse(betweenParam) as Array<{ [key: string]: [string, string] }>;
    const result: BetweenQuery[] = [];

    for (const item of betweenArray) {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          result.push({ key, value: item[key] });
        }
      }
    }

    return result;
  } catch (error) {
    throw new ValidationError('Invalid JSON format for between parameter');
  }
}

/**
 * Extracts single parameters from a given string.
 * @param params The parameter string to be processed.
 * @returns An array of parameters.
 */
export function extractParamsSingle(params: string): string[] {
  return params.split(',').map(param => param.trim());
}

/**
 * Escapes a string by removing characters that are not alphanumeric or underscores.
 * @param str The string to be escaped.
 * @returns The escaped string.
 */
export function escapeString(str: string): string {
  return str.replace(/[^a-zA-Z0-9_]/g, "");
}

export interface SortParam {
  key: string;
  order: "ASC" | "DESC";
}