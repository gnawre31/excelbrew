import { useStore } from "../config/store";
import { Label } from "../config/types";

const Headers = () => {
  const labels = useStore((state) => state.labels);
  const updateLabels = useStore((state) => state.updateLabels);
  const newLabel = useStore((state) => state.newLabel);
  const deleteLabel = useStore((state) => state.deleteLabel);

  const labelChange = (label: Label, text: string, key: string, id: string) => {
    let newLabel: Label = label;
    if (key === "label") newLabel["label"] = text;
    else if (key === "name") newLabel["name"] = text;
    updateLabels(newLabel, id);
  };
  return (
    <div
      className="bg-gray-700 text-white pl-12 pr-12 pt-24 pb-24 overflow-auto"
      style={{ width: "470px" }}
    >
      {/* buttons */}
      <div className="flex mb-8 ">
        <button
          onClick={() => newLabel("column")}
          className="w-28 h-12 mr-2 hover:border-white border border-gray-700 bg-gray-500 rounded-lg text-left pl-4 "
        >
          + Column
        </button>
        <button
          onClick={() => newLabel("cell")}
          className="w-28 h-12 hover:border-white border border-gray-700 bg-gray-500 rounded-lg text-left pl-4"
        >
          + Cell
        </button>
      </div>
      {labels.map((l, idx) => (
        <div
          key={idx}
          className="mb-2 flex space-x-4 bg-gray-600 p-4 rounded-xl w-auto"
        >
          <p className=" w-16 pt-2 pb-2 capitalize">{l.type}</p>
          <input
            type="text"
            value={l.label}
            className="w-36 bg-gray-500 hover:bg-gray-500 p-2 rounded-lg focus:outline-1 focus:outline-white"
            onChange={(e) => labelChange(l, e.target.value, "label", l.id)}
            placeholder={
              l.type === "cell" ? "Example: Quota" : "Example: Sales"
            }
          />
          <input
            type="text"
            value={l.name}
            className="w-12 bg-gray-500 hover:bg-gray-500 p-2 rounded-lg focus:outline-1 focus:outline-white"
            onChange={(e) => labelChange(l, e.target.value, "name", l.id)}
            placeholder={l.type === "cell" ? "C2" : "A"}
          />
          <button className="p-2 w-12 font-bold rounded-full hover:bg-gray-500" onClick={() => deleteLabel(l.id)}>
            X
          </button>
        </div>
      ))}
    </div>
  );
};

export default Headers;
