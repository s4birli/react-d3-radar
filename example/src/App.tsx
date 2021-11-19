import BubbleRadar, { MainType, RiskType } from "d3-bubble-radar";
import React, { useEffect } from "react";
import { fakeData } from "./Data";

function App() {
  const data: MainType[] = fakeData
    .filter((item: MainType) => item.type && item.subCategory)
    .map((item: MainType) => {
      const index: number = RiskType[item.type].indexOf(item.subCategory) + 1;
      item.subCategoryIndex = index;
      return item;
    });

  const [realdata, setData] = React.useState<MainType[]>([data[0]]);
  useEffect(() => {
    let i = 10;
    const interval = setInterval(() => {
      setData(data.slice(0, i));
      i+=10;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <BubbleRadar data={realdata} />
    </div>
  );
}

export default App;
