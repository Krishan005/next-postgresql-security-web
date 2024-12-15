"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";

interface AddChartFormProps {
  onClose: () => void; // Callback to close the modal
  onSubmit: (data: { name: string; data: any[] }) => void; // Callback to handle form submission
}

const AddChartForm: React.FC<AddChartFormProps> = ({ onClose, onSubmit }) => {
  const [chartTitle, setChartTitle] = useState("");
  const [formDataList, setFormDataList] = useState([
    { NVAA: "", VAA: "", SVAA: "", UNB: "", TOTAL: "" },
  ]);
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedFormDataList: any = [...formDataList];
    updatedFormDataList[index][name] = value;

    // Calculate TOTAL
    const NVAA = parseFloat(updatedFormDataList[index].NVAA) || 0;
    const VAA = parseFloat(updatedFormDataList[index].VAA) || 0;
    const SVAA = parseFloat(updatedFormDataList[index].SVAA) || 0;
    const UNB = parseFloat(updatedFormDataList[index].UNB) || 0;
    updatedFormDataList[index]["TOTAL"] = NVAA + VAA + SVAA + UNB;

    setFormDataList(updatedFormDataList);
  };

  const handleAddRow = () => {
    setFormDataList([
      ...formDataList,
      { NVAA: "", VAA: "", SVAA: "", UNB: "", TOTAL: "" },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setFormDataList(formDataList.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: any = {};
    let isValid = true;

    if (!chartTitle) {
      newErrors.chartTitle = "Chart Name is required.";
      isValid = false;
    }

    formDataList.forEach((data: any, index) => {
      ["NVAA", "VAA", "SVAA", "UNB"].forEach((field) => {
        if (isNaN(parseFloat(data[field])) || data[field] === "") {
          newErrors[`${field}-${index}`] = `${field} must be a valid number.`;
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({ name: chartTitle, data: formDataList });
    Swal.fire({
      title: "Chart Added",
      text: "The chart has been successfully added.",
      icon: "success",
      confirmButtonText: "OK",
    });
    onClose();
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-semibold text-center mb-4">Add Chart</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">
            Chart Name
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={chartTitle}
            onChange={(e) => setChartTitle(e.target.value)}
          />
          {errors.chartTitle && (
            <span className="text-red-500 text-sm">{errors.chartTitle}</span>
          )}
        </div>

        {formDataList.map((formData: any, index) => (
          <div key={index} className="flex flex-wrap gap-4 items-center mb-4">
            {["NVAA", "VAA", "SVAA", "UNB"].map((field: any) => (
              <div key={field} className="w-1/5">
                <input
                  type="text"
                  name={field}
                  placeholder={field}
                  value={formData[field]}
                  onChange={(e) => handleInputChange(index, e)}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors[`${field}-${index}`] && (
                  <span className="text-red-500 text-sm">
                    {errors[`${field}-${index}`]}
                  </span>
                )}
              </div>
            ))}
            <div className="w-1/5">
              <input
                type="text"
                name="TOTAL"
                placeholder="TOTAL"
                value={formData.TOTAL}
                readOnly
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => handleRemoveRow(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleAddRow}
        >
          Add Row
        </button>
        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddChartForm;
