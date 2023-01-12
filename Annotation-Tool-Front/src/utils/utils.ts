export const capitalizeStr = (str: string): string  => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const removeFileExtension = (str: string): string => {
  return str.replace(/\.[^/.]+$/, "")
}

export const generateRandomColor = (): string => {
    var r = () => Math.random() * 256 >> 0;
    return `${r()}, ${r()}, ${r()}`;
}

export const groupBy = (items: any) => {
    return items.reduce((previousItems: any, currentItem: any) => {
      if (currentItem) {
        const number = currentItem?.number;
        
        const currentGroup = previousItems[number];

        return { 
          ...previousItems,
          [number]: currentGroup ? [...currentGroup, currentItem]: [currentItem]
        };
      }
      return previousItems;
    }, {});
}

/**
 * mui pagination functions
 * https://mui.com/material-ui/react-table/ 
 * **/
export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
export function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
/* end of mui pagination functions*/