export const getSubIds = (child) => {
  const subIds = [];
  const traverse = (data) => {
    if (data && data.length) {
      const first = data[0];
      subIds.push(first.id);
      traverse(first._child);
    }
  };
  traverse(child);
  return subIds;
};
