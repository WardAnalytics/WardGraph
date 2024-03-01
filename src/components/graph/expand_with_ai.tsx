import { AddressAnalysis, Category } from "../../api/model";
import { CategoryClasses } from "../../utils/categories";

import { PathExpansionArgs } from "./Graph";

function getCategoryRisk(category: string): number {
  const categoryClass = CategoryClasses[category];

  if (!categoryClass) {
    return 0;
  }

  return categoryClass.risk;
}

function getCategoryPaths(
  originAddress: string,
  category: Category,
): string[][] {
  const paths = [];
  for (const e of category.entities) {
    for (const a of e.addresses) {
      if (a.paths) {
        for (const p of a.paths) {
          paths.push(p);
        }
      } else {
        paths.push([originAddress, a.hash]);
      }
    }
  }

  return paths;
}

/** Expand with AI algorithm
 *
 * @param analysisData - The analysis data of the address returned by the API
 * @param maxPaths - The maximum number of paths to be expanded (default 4)
 * @returns - The paths to be expanded
 */

function getExpandWithAIPaths(
  analysisData: AddressAnalysis,
  maxPaths: number = 4,
): PathExpansionArgs[] {
  // We'll first do it for incoming and then for outgoing to get balanced results
  let pathExpansionArgs: PathExpansionArgs[] = [];

  // Compile all categories in the analysisData
  let categories: Category[] = [];
  categories.push(...analysisData.incomingDirectExposure.categories);
  categories.push(...analysisData.incomingIndirectExposure.categories);

  // Now sort the categories by risk, starting from the highest risk
  categories.sort((a, b) => getCategoryRisk(b.name) - getCategoryRisk(a.name));

  // Now iterate through the first categories until at least 15 paths have been added
  for (const category of categories) {
    const paths: string[][] = getCategoryPaths(analysisData.address, category);

    // If the paths plus the already added paths are more than the max paths, then trim the paths
    const remainingPaths = maxPaths - pathExpansionArgs.length;

    // If no more can be added, just stop
    if (remainingPaths === 0) {
      break;
    }
    pathExpansionArgs.push({
      paths: paths.slice(0, remainingPaths),
      incoming: true,
    });
  }

  // Now do the same for outgoing
  categories = [];
  categories.push(...analysisData.outgoingDirectExposure.categories);
  categories.push(...analysisData.outgoingIndirectExposure.categories);

  // Now sort the categories by risk, starting from the highest risk
  categories.sort((a, b) => getCategoryRisk(b.name) - getCategoryRisk(a.name));

  // Now iterate through the first categories until at least 15 paths have been added
  for (const category of categories) {
    const paths: string[][] = getCategoryPaths(analysisData.address, category);

    // If the paths plus the already added paths are more than the max paths, then trim the paths
    const remainingPaths = maxPaths * 2 - pathExpansionArgs.length; // *2 because we already added the incoming paths

    // If no more can be added, just stop
    if (remainingPaths === 0) {
      break;
    }
    pathExpansionArgs.push({
      paths: paths.slice(0, remainingPaths),
      incoming: false,
    });
  }

  // Add the paths to the graph
  return pathExpansionArgs;
}

export default getExpandWithAIPaths;
