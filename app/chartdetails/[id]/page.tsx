"use client";

import React, { useEffect, useState, use } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { getChartById } from "@/app/slices/getChartData";
import { updateChart } from "@/app/slices/updateChart";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

let userDetails: any = {};
if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
  userDetails = JSON.parse(window.atob(String(sessionStorage.getItem("user"))));
}
const roleID = userDetails?.role;

Chart.register(...registerables);

const ChartDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const dispatch = useAppDispatch();
  const [chart, setChart] = useState<any>(null);
  const [chartDataList, setChartDataList] = useState<any>(null);
  const [formDataList, setFormDataList] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [chartTitle, setChartTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { chartData, chartDataLoading, chartDataError } = useAppSelector(
    (state) => state.getChart
  );

  const { editChart, editloading, editerror } = useAppSelector(
    (state) => state.updateChart
  );

  const { id } = use(params);

  useEffect(() => {
    if (id) {
      dispatch(getChartById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (chartData) {
      var newChart: any = chartData;
      setChart(newChart?.chart);
      setChartDataList(newChart?.chartData || []);
      setFormDataList(
        newChart?.chartData.map((data: any) => {
          return {
            NVAA: data.NVAA,
            VAA: data.VAA,
            SVAA: data.SVAA,
            UNB: data.UNB,
            TOTAL: data.TOTAL,
          };
        })
      );
      setChartTitle(newChart?.chart?.name);
    }
  }, [chartData, editChart]);

  useEffect(() => {
    if (editloading) {
      dispatch(getChartById(id));
    }
  }, [editloading, chartData, dispatch]);

  const yamazumiChartData = {
    labels: chartDataList?.map(
      (_: any, index: number) => `Station ${index + 1}`
    ),
    datasets: [
      {
        label: "NVAA",
        backgroundColor: "#2b6cb0",
        data: chartDataList?.map((data: any) => data.NVAA || 0),
      },
      {
        label: "VAA",
        backgroundColor: "#ed8936",
        data: chartDataList?.map((data: any) => data.VAA || 0),
      },
      {
        label: "SVAA",
        backgroundColor: "#38a169",
        data: chartDataList?.map((data: any) => data.SVAA || 0),
      },
      {
        label: "UNB",
        backgroundColor: "#63b3ed",
        data: chartDataList?.map((data: any) => data.UNB || 0),
      },
    ],
  };

  const yamazumiChartOptions = {
    plugins: {
      title: {
        display: true,
        text: "Yamazumi Chart ",
        font: { size: 18 },
      },
      legend: {
        display: true,
        position: "top" as const,
      },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true },
    },
  };

  const pieChartData = chartDataList?.[0]
    ? {
        labels: ["NVAA", "VAA", "SVAA", "UNB"],
        datasets: [
          {
            data: [
              (chartDataList[0].NVAA / chartDataList[0].TOTAL) * 100 || 0,
              (chartDataList[0].VAA / chartDataList[0].TOTAL) * 100 || 0,
              (chartDataList[0].SVAA / chartDataList[0].TOTAL) * 100 || 0,
              (chartDataList[0].UNB / chartDataList[0].TOTAL) * 100 || 0,
            ],
            backgroundColor: ["#2b6cb0", "#ed8936", "#38a169", "#63b3ed"],
            hoverBackgroundColor: ["#2c5282", "#dd6b20", "#276749", "#4299e1"],
          },
        ],
      }
    : {
        labels: [],
        datasets: [],
      };

  const pieChartOptions = {
    plugins: {
      title: {
        display: true,
        text: "Station 1",
        font: { size: 18 },
      },
      legend: {
        display: true,
        position: "top" as const,
      },
    },
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = validateForm();
    if (isValid) {
      console.log("Updated Chart Data:", formDataList);
      dispatch(
        updateChart({
          chartId: id,
          name: chartTitle,
          data: formDataList,
        })
      );
      setIsModalOpen(false);
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const validationErrors: any = {};

    formDataList.forEach((data, index) => {
      if (!data.NVAA || isNaN(data.NVAA))
        validationErrors[`NVAA-${index}`] = "Invalid NVAA";
      if (!data.VAA || isNaN(data.VAA))
        validationErrors[`VAA-${index}`] = "Invalid VAA";
      if (!data.SVAA || isNaN(data.SVAA))
        validationErrors[`SVAA-${index}`] = "Invalid SVAA";
      if (!data.UNB || isNaN(data.UNB))
        validationErrors[`UNB-${index}`] = "Invalid UNB";
    });
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedFormData = [...formDataList];
    updatedFormData[index] = { ...updatedFormData[index], [name]: value };

    const NVAA = parseFloat(updatedFormData[index].NVAA) || 0;
    const VAA = parseFloat(updatedFormData[index].VAA) || 0;
    const SVAA = parseFloat(updatedFormData[index].SVAA) || 0;
    const UNB = parseFloat(updatedFormData[index].UNB) || 0;

    updatedFormData[index]["TOTAL"] = String(NVAA + VAA + SVAA + UNB);
    setFormDataList(updatedFormData);
  };

  const handleAddRow = () => {
    setFormDataList([
      ...formDataList,
      { NVAA: "", VAA: "", SVAA: "", UNB: "", TOTAL: 0 },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedFormData = formDataList.filter((_, i) => i !== index);
    setFormDataList(updatedFormData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen">
      <Sidebar name={"chart"} />
      <div className="flex-1 bg-gray-100">
        <Navbar name={"Chart Details"} />
        <main className="p-4 sm:p-6">
          <h1 className="text-2xl font-semibold">
            Welcome to the Chart Details page
          </h1>
          <p className="mt-4 text-gray-700">This is the details page content</p>

          <div className="flex justify-between">
            {roleID == 2 || roleID == 1 ? (
              <button
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto m-2"
                onClick={handleEditClick}
              >
                Edit Chart
              </button>
            ) : (
              ""
            )}

            <div className="flex justify-end">
              <button
                className="mt-6 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handlePrint}
              >
                Print
              </button>
            </div>
          </div>

          <div>
            {chart && (
              <div className="flex flex-wrap items-center justify-between mt-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Chart Name: {chart.name}
                </h2>
                <p className="text-gray-600">
                  Created Date: {new Date(chart.createAt).toDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Yamazumi Chart Section */}
          <section>
            <div className="mt-8 mb-4 text-xl font-semibold text-gray-800">
              Yamazumi Chart
            </div>
            <div className="mt-4 h-[300px]">
              <Bar data={yamazumiChartData} options={yamazumiChartOptions} />
            </div>

            <div className="mt-4 overflow-y-auto max-h-[400px] shadow-lg rounded-lg">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Station
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      NVAA
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      VAA
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      SVAA
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      UNB
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chartDataList?.map((data: any, index: number) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100`}
                    >
                      <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">{`Station ${
                        index + 1
                      }`}</td>
                      <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                        {data.NVAA}
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                        {data.VAA}
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                        {data.SVAA}
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                        {data.UNB}
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                        {data.TOTAL}
                      </td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr className="bg-gray-100 font-semibold">
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                      Total
                    </td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                      {chartDataList?.reduce(
                        (sum: number, data: { NVAA: any }) =>
                          sum + Number(data.NVAA),
                        0
                      )}
                    </td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                      {chartDataList?.reduce(
                        (sum: number, data: { VAA: any }) =>
                          sum + Number(data.VAA),
                        0
                      )}
                    </td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                      {chartDataList?.reduce(
                        (sum: number, data: { SVAA: any }) =>
                          sum + Number(data.SVAA),
                        0
                      )}
                    </td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                      {chartDataList?.reduce(
                        (sum: number, data: { UNB: any }) =>
                          sum + Number(data.UNB),
                        0
                      )}
                    </td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-800"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Saturation Chart Section */}
          <section>
            <div className="mt-8 mb-4 text-xl font-semibold text-gray-800">
              Saturation Chart
            </div>

            <div className="w-full sm:w-96 h-96 mx-auto">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>

            <div className="mt-4 overflow-y-auto max-h-[400px] shadow-lg rounded-lg">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Station
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      NVAA
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      VAA
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      SVAA
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      UNB
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chartDataList?.map((data: any, index: number) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100`}
                    >
                      <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                        {`Station ${index + 1}`}
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                        {((data.NVAA / data.TOTAL) * 100).toFixed(2)}%
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                        {((data.VAA / data.TOTAL) * 100).toFixed(2)}%
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                        {((data.SVAA / data.TOTAL) * 100).toFixed(2)}%
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                        {((data.UNB / data.TOTAL) * 100).toFixed(2)}%
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                        100%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Modal */}
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
                Edit Chart
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
              </div>

              {/* Form Data */}
              {formDataList.map((formData, index) => (
                <div
                  key={index}
                  className="flex flex-wrap gap-4 items-center border-b pb-4 mb-4"
                >
                  <div className="w-full md:w-1/6">
                    <input
                      type="text"
                      name="NVAA"
                      placeholder="NVAA"
                      value={formData.NVAA}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/6">
                    <input
                      type="text"
                      name="VAA"
                      placeholder="VAA"
                      value={formData.VAA}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/6">
                    <input
                      type="text"
                      name="SVAA"
                      placeholder="SVAA"
                      value={formData.SVAA}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/6">
                    <input
                      type="text"
                      name="UNB"
                      placeholder="UNB"
                      value={formData.UNB}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/6">
                    <input
                      type="text"
                      name="TOTAL"
                      placeholder="TOTAL"
                      value={
                        Number(formData.NVAA) +
                        Number(formData.VAA) +
                        Number(formData.SVAA) +
                        Number(formData.UNB)
                      }
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/6">
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleRemoveRow(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={handleAddRow}
                >
                  Add Row
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    ) : null}

                    {isSubmitting ? "" : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartDetail;
