import React from "react";
import { useStore } from "../config/store";

const Form = () => {
  const product = useStore((state) => state.product);
  const user_input = useStore((state) => state.user_input);
  const response = useStore((state) => state.response);
  const error = useStore((state) => state.error);
  const loading = useStore((state) => state.loading);
  const updateProduct = useStore(state => state.updateProduct)
  const setUserInput = useStore((state) => state.setUserInput);
  const getFormula = useStore((state) => state.getFormula);

  const getResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    getFormula();
  };

  const activeProductStyle = "w-48 p-4 rounded-full mr-4 cursor-pointer bg-green-600 text-white"
  const inactiveProductStyle = "w-48 p-4 rounded-full mr-4 cursor-pointer bg-gray-200"


  return (
    <div className="w-1/2 mt-36 m-auto">
      <div className="flex mb-8">
        <div className={product === "Excel" ? activeProductStyle : inactiveProductStyle } onClick={()=>updateProduct("Excel")}>
          <p className="text-center">Excel</p>
        </div>
        <div  className={product === "Google Sheets" ? activeProductStyle : inactiveProductStyle } onClick={()=>updateProduct("Google Sheets")}>
          <p className="text-center">Google Sheets</p>
        </div>
      </div>

      <form onSubmit={getResponse} className="flex flex-col">
        <label className="mb-4 font-bold text-xl">
          What do you want the formula to do?
        </label>
        <textarea
          value={user_input}
          className="mb-4 border border-2 rounded-md h-36 bg-gray-100 pl-4 pr-4 pt-4 pb-4"
          onChange={(e) => setUserInput(e.target.value as string)}
        />
        <button type="submit" className={`text-white w-48 h-16 rounded-xl float-right ${loading ? " bg-gray-400" : " bg-green-600"}`} disabled={loading ? true : false}>
          {!loading ? <p>Get Formula</p> : <p>Loading...</p>}
        </button>
        <p className="font-bold text-xl mt-8 mb-4">Output:</p>

        <textarea
          value={response}
          className="mb-4 border border-2 rounded-md h-36 bg-gray-100 bg-gray-100 pl-4 pr-4 pt-4 pb-4 focus:outline-none"
        ></textarea>
        <p className="text-red-600">{error}</p>
      </form>
    </div>
  );
};

export default Form;
