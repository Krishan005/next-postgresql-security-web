"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { addChart } from "../slices/addChart";
import { getCharts } from "../slices/getCharts";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

let userDetails: any = {};
if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
  userDetails = JSON.parse(window.atob(String(sessionStorage.getItem("user"))));
}
const roleID = userDetails?.role;

const Dashboard = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const [loadingData, setLoadingData] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chartTitle, setChartTitle] = useState<any>("");
  const [formDataList, setFormDataList] = useState([
    {
      NVAA: "",
      VAA: "",
      SVAA: "",
      UNB: "",
      TOTAL: "",
    },
  ]);
  const [charts, setCharts] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});

  const { chartList, chartloading, charterror } = useAppSelector(
    (state) => state.charts
  );

  const {
    addChart: addedChart,
    loading,
    error,
  } = useAppSelector((state) => state.addChart);

  useEffect(() => {
    dispatch(getCharts());
  }, [dispatch, loading]);

  useEffect(() => {
    console.log("chartList", chartList);

    var chartListNew: any = chartList;
    console.log("chartList1", chartListNew);
    if (chartListNew?.charts?.length > 0) {
      console.log("chartList2", chartList);

      setCharts(chartListNew?.charts);
      setLoadingData(false);
    }
  }, [chartList, loadingData]);

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedFormDataList: any = [...formDataList];
    updatedFormDataList[index][name] = value;

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
      {
        NVAA: "",
        VAA: "",
        SVAA: "",
        UNB: "",
        TOTAL: "",
      },
    ]);
  };

  const handleRemoveRow = (index: any) => {
    const updatedFormDataList = formDataList.filter((_, i) => i !== index);
    setFormDataList(updatedFormDataList);
  };

  const validateForm = () => {
    const newErrors: any = {};
    let isValid = true;

    if (!chartTitle) {
      newErrors.chartTitle = "Chart Name is required.";
      isValid = false;
    }

    formDataList.forEach((data, index) => {
      const { NVAA, VAA, SVAA, UNB } = data;

      if (isNaN(parseFloat(NVAA)) || NVAA === "") {
        newErrors[`NVAA-${index}`] = "NVAA must be a valid number.";
        isValid = false;
      }
      if (isNaN(parseFloat(VAA)) || VAA === "") {
        newErrors[`VAA-${index}`] = "VAA must be a valid number.";
        isValid = false;
      }
      if (isNaN(parseFloat(SVAA)) || SVAA === "") {
        newErrors[`SVAA-${index}`] = "SVAA must be a valid number.";
        isValid = false;
      }
      if (isNaN(parseFloat(UNB)) || UNB === "") {
        newErrors[`UNB-${index}`] = "UNB must be a valid number.";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      var data: any = { name: chartTitle, data: formDataList };

      dispatch(addChart(data));

      Swal.fire({
        title: "Chart Added",
        text: "The chart has been successfully added.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setIsModalOpen(false);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to add chart. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleViewChart = (chartId: string) => {
    console.log(`Viewing chart with ID: ${chartId}`);

    router.push(`/chartdetails/${chartId}`);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100">
        <Navbar name={"Dashboard"} />
        <main className="p-6">
          <h1 className="text-2xl font-semibold">Welcome to the Dashboard</h1>
          <p className="mt-4">This is the dashboard page content.</p>

          {roleID == 2 ? (
            <div className="flex justify-end">
              <button
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setIsModalOpen(true)}
              >
                Add Chart
              </button>
            </div>
          ) : (
            ""
          )}

          <div className="mt-6">
            <h2 className="text-xl font-semibold">Existing Charts</h2>
            {/* Scrollable and Responsive Container */}
            <div className="overflow-x-auto mt-4 border border-gray-300 rounded-lg shadow-md">
              <table
                className="min-w-full "
                style={{ height: "300px", overflowY: "scroll" }}
              >
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold ">
                      Chart Title
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold ">
                      Chart ID
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold ">
                      Created At
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold ">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {charts.length > 0 ? (
                    charts.map((chart: any, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100`}
                      >
                        <td className="px-4 py-2 border-b text-sm text-gray-800">
                          {chart.name}
                        </td>
                        <td className="px-4 py-2 border-b text-sm text-gray-800">
                          {chart.chartId}
                        </td>
                        <td className="px-4 py-2 border-b text-sm text-gray-800">
                          {new Date(chart.createAt).toDateString()}
                        </td>
                        <td className="px-4 py-2 border-b text-sm text-gray-800">
                          <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => handleViewChart(chart.chartId)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-2 text-center text-gray-500"
                      >
                        No charts available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div
                className="bg-white rounded-lg shadow-lg w-full max-w-4xl md:w-2/3"
                style={{
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                <div className="p-4 md:p-6 border-b">
                  <h2 className="text-xl font-semibold text-center md:text-left">
                    Add Chart
                  </h2>
                </div>
                <form className="p-4 md:p-6" onSubmit={handleSubmit}>
                  {/* Chart Name */}
                  <div className="mb-4">
                    <label
                      htmlFor="chartName"
                      className="block text-gray-700 font-semibold"
                    >
                      Chart Name
                    </label>
                    <input
                      type="text"
                      id="chartName"
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      value={chartTitle}
                      onChange={(e) => setChartTitle(e.target.value)}
                    />
                    {errors.chartTitle && (
                      <span className="text-red-500 text-sm">
                        {errors.chartTitle}
                      </span>
                    )}
                  </div>

                  {/* Form Data */}
                  {formDataList.map((formData, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap gap-4 items-center border-b pb-4 mb-4"
                    >
                      {/* Other input fields (e.g., NVAA, VAA, SVAA, UNB) */}
                      <div className="w-full md:w-1/5">
                        <input
                          type="text"
                          name="NVAA"
                          placeholder="NVAA"
                          value={formData.NVAA}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors[`NVAA-${index}`] && (
                          <span className="text-red-500 text-sm">
                            {errors[`NVAA-${index}`]}
                          </span>
                        )}
                      </div>
                      <div className="w-full md:w-1/5">
                        <input
                          type="text"
                          name="VAA"
                          placeholder="VAA"
                          value={formData.VAA}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors[`VAA-${index}`] && (
                          <span className="text-red-500 text-sm">
                            {errors[`VAA-${index}`]}
                          </span>
                        )}
                      </div>
                      <div className="w-full md:w-1/5">
                        <input
                          type="text"
                          name="SVAA"
                          placeholder="SVAA"
                          value={formData.SVAA}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors[`SVAA-${index}`] && (
                          <span className="text-red-500 text-sm">
                            {errors[`SVAA-${index}`]}
                          </span>
                        )}
                      </div>
                      <div className="w-full md:w-1/5">
                        <input
                          type="text"
                          name="UNB"
                          placeholder="UNB"
                          value={formData.UNB}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors[`UNB-${index}`] && (
                          <span className="text-red-500 text-sm">
                            {errors[`UNB-${index}`]}
                          </span>
                        )}
                      </div>
                      <div className="w-full md:w-1/5">
                        <input
                          type="text"
                          name="TOTAL"
                          placeholder="TOTAL"
                          value={formData.TOTAL}
                          readOnly
                          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="button"
                        className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => handleRemoveRow(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                    <button
                      type="button"
                      className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={handleAddRow}
                    >
                      Add Row
                    </button>

                    <div className="flex gap-2 mt-4 sm:mt-0">
                      <button
                        type="button"
                        className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
