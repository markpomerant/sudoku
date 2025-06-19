import { useState, useMemo } from "react";

function getRelatedIndexes(index) {
  const row = Math.floor(index / 9);
  const col = index % 9;
  const related = new Set();
  for (let i = 0; i < 9; i++) related.add(row * 9 + i);
  for (let i = 0; i < 9; i++) related.add(i * 9 + col);
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      related.add((boxRow + r) * 9 + (boxCol + c));
    }
  }
  return related;
}

export function useSelectionAndHighlighting(cells, highlightUsedNumbers) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const usedValues = useMemo(() => {
    if (!highlightUsedNumbers || selectedIndex == null) return new Set();
    const related = getRelatedIndexes(selectedIndex);
    const values = new Set();
    for (let i of related) {
      const val = cells[i].value;
      if (val !== 0) values.add(val);
    }
    return values;
  }, [cells, selectedIndex, highlightUsedNumbers]);

  const handleCellClick = (index) => {
    if (!cells[index].isInitial) {
      setSelectedIndex(index);
    }
  };

  return {
    selectedIndex,
    setSelectedIndex,
    usedValues,
    handleCellClick,
  };
}
