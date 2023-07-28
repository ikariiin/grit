export function pathResolve(...args: string[]): string {
  // Join all path arguments into a single path string
  const resolvedPath = args.join("/");

  // Split the path into segments based on '/'
  const segments = resolvedPath.split("/");

  // Iterate through the segments and resolve relative paths
  const resolvedSegments: string[] = [];
  for (const segment of segments) {
    if (segment === "..") {
      // If the segment is '..', remove the last resolved segment
      resolvedSegments.pop();
    } else if (segment !== ".") {
      // Skip segments that are '.'
      resolvedSegments.push(segment);
    }
  }

  // Join the resolved segments back into a single path
  const result = resolvedSegments.join("/");

  // Prepend the protocol and domain if the path is not absolute
  if (!result.startsWith("/") && !result.startsWith("http://") && !result.startsWith("https://")) {
    return `/${result}`;
  }

  return result;
}
