import BubbleRadar, { MainType, RiskType } from "d3-bubble-radar";
import { fakeData } from "./Data";

function App() {
  const data: MainType[] = fakeData
    .filter((item: MainType) => item.type && item.subCategory)
    .map((item: MainType) => {
      const index: number = RiskType[item.type].indexOf(item.subCategory) + 1;
      item.subCategoryIndex = index;
      return item;
    });

  return (
    <div className="App">
      <BubbleRadar data={data} />
    </div>
  );
}

export default App;
