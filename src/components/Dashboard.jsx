import { React, useContext, useState, useEffect, memo } from "react";
import { GiShoppingCart } from "react-icons/gi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { GrNotes } from "react-icons/gr";
import { ThemeContext } from "./Navbar";
import Chart from "react-apexcharts";
import DataTable from "react-data-table-component";
import "rsuite/dist/rsuite-no-reset.min.css";

import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import DateRangePicker from "rsuite/DateRangePicker";
import axios from "axios";
import { useAuth } from "../context/auth.context";
import { formatCostNumber } from "../utils/helper";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const columns = [
  {
    name: "Sản phẩm",
    selector: (row) => row.name,
  },
  {
    name: "Số lượng đã bán",
    selector: (row) => row.count,
    sortable: true,
  },
  {
    name: "Doanh thu",
    selector: (row) => row.revenue,
    sortable: true,
  },
];
const predefinedRanges = [
  {
    label: "Today",
    value: [new Date(), new Date()],
    placement: "left",
  },
  {
    label: "Yesterday",
    value: [addDays(new Date(), -1), addDays(new Date(), -1)],
    placement: "left",
  },
  {
    label: "This week",
    value: [startOfWeek(new Date()), endOfWeek(new Date())],
    placement: "left",
  },
  {
    label: "Last 7 days",
    value: [subDays(new Date(), 6), new Date()],
    placement: "left",
  },
  {
    label: "Last 30 days",
    value: [subDays(new Date(), 29), new Date()],
    placement: "left",
  },
  {
    label: "This month",
    value: [startOfMonth(new Date()), new Date()],
    placement: "left",
  },
  {
    label: "Last month",
    value: [
      startOfMonth(addMonths(new Date(), -1)),
      endOfMonth(addMonths(new Date(), -1)),
    ],
    placement: "left",
  },
  {
    label: "This year",
    value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
    placement: "left",
  },
  {
    label: "Last year",
    value: [
      new Date(new Date().getFullYear() - 1, 0, 1),
      new Date(new Date().getFullYear(), 0, 0),
    ],
    placement: "left",
  },
  {
    label: "All time",
    value: [new Date(new Date().getFullYear(), 0, 2), new Date()],
    placement: "left",
  },
  {
    label: "Last week",
    closeOverlay: false,
    value: (value) => {
      const [start = new Date()] = value || [];
      return [
        addDays(startOfWeek(start, { weekStartsOn: 0 }), -7),
        addDays(endOfWeek(start, { weekStartsOn: 0 }), -7),
      ];
    },
    appearance: "default",
  },
  {
    label: "Next week",
    closeOverlay: false,
    value: (value) => {
      const [start = new Date()] = value || [];
      return [
        addDays(startOfWeek(start, { weekStartsOn: 0 }), 7),
        addDays(endOfWeek(start, { weekStartsOn: 0 }), 7),
      ];
    },
    appearance: "default",
  },
];
const Dashboard = memo(function Dashboard() {
  const theme = useContext(ThemeContext);
  const { token } = useAuth();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [year, setYear] = useState("");

  const [profit, setProfit] = useState();
  const [countOrder, setCountOrder] = useState();
  const [revenue, setRevenue] = useState([]);
  const [topMenu, setTopMenu] = useState([]);

  const getFilterDate = (value) => {
    if (value == null || value === undefined) return;
    const start = format(value[0], "yyyy-MM-dd");
    setStart(start);
    const end = format(value[1], "yyyy-MM-dd");
    setEnd(end);
    const s = start.split("-");
    if (s[2] == "01" && s[1] == "01") {
      setYear(s[0]);
    } else setYear("");
  };
  const mixed = {
    series: [
      {
        name: "Doanh thu",
        data: revenue?.map((item) => item[1]),
      },
    ],
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [5, 7, 5],
      curve: "smooth",
      dashArray: [0, 8, 5],
    },

    legend: {
      tooltipHoverFormatter: function (val, opts) {
        return (
          val +
          " - " +
          opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
          ""
        );
      },
    },
    markers: {
      size: 0,
      hover: {
        sizeOffset: 6,
      },
    },
    xaxis: {
      categories: revenue?.map((item) =>
        year ? months[item[0] - 1] : item[0]
      ),
    },
    tooltip: {
      y: [
        {
          title: {
            formatter: function (val) {
              return val + " (VND)";
            },
          },
        },
      ],
    },
    grid: {
      borderColor: "#f1f1f1",
    },
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const profit = await axios.get(
          `analytics/profit?start=${start}&end=${end}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const countOrder = await axios.get(
          `orders/amount?start=${start}&end=${end}&status=paid`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const revenue = await axios.get(
          `analytics/revenue?y=${year}&start=${start}&end=${end}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const menu = await axios.get(
          `analytics/menu?type=all&start=${start}&end=${end}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setProfit(profit.data);
        setCountOrder(countOrder.data);
        setRevenue(revenue.data);
        setTopMenu(
          menu.data?.map((item) => ({
            name: (
              <div className="flex items-center">
                <span>{item[0]}</span>
              </div>
            ),
            count: item[1],
            revenue: formatCostNumber(item[2]),
          }))
        );
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [start, end, year]);

  return (
    <div className={`m-auto max-w-[1440px] w-full flex flex-col  px-4 py-12`}>
      <div
        className={`flex items-center bg-white shadow-xl p-6 rounded-lg w-full mb-12 justify-between`}
      >
        <DateRangePicker
          appearance="subtle"
          defaultValue={[new Date(new Date().getFullYear(), 0, 2), new Date()]}
          ranges={predefinedRanges}
          onChange={(value) => getFilterDate(value)}
        />
      </div>
      <div className="w-full flex gap-4 items-center justify-between">
        <div
          className={`w-[330px] flex items-center justify-center gap-4 rounded-xl shadow-xl border-2 ${
            theme.mode ? "bg-white" : "bg-[#3f3f3f]"
          } h-[200px]`}
        >
          <div className="p-4 rounded-lg bg-green-300">
            <GiShoppingCart
              className={`${theme.mode ? "" : "text-black"}`}
              size={45}
            />
          </div>
          <div className="flex flex-col text-center">
            <span className="font-semibold text-sm">
              Số lượng đơn hàng bán được
            </span>
            <span className="font-bold text-2xl">{countOrder}</span>
          </div>
        </div>
        <div
          className={`w-[330px] flex items-center justify-center gap-4 rounded-xl shadow-xl border-2 ${
            theme.mode ? "bg-white" : "bg-[#3f3f3f]"
          } h-[200px]`}
        >
          <div className="p-4 rounded-lg bg-green-300">
            <MdOutlineAttachMoney
              className={`${theme.mode ? "" : "text-black"}`}
              size={45}
            />
          </div>
          <div className="flex flex-col text-center">
            <span className="font-semibold text-sm">Tổng lợi nhuận</span>
            <span className="font-bold text-2xl">
              {formatCostNumber(profit?.profit)}
            </span>
          </div>
        </div>
        <div
          className={`w-[330px] flex items-center justify-center gap-4 rounded-xl shadow-xl border-2 ${
            theme.mode ? "bg-white" : "bg-[#3f3f3f]"
          } h-[200px]`}
        >
          <div className="p-4 rounded-lg bg-green-300">
            <GiReceiveMoney
              className={`${theme.mode ? "" : "text-black"}`}
              size={45}
            />
          </div>
          <div className="flex flex-col text-center">
            <span className="font-semibold text-sm">Tổng doanh thu</span>
            <span className="font-bold text-2xl">
              {formatCostNumber(profit?.revenue)}
            </span>
          </div>
        </div>
        <div
          className={`w-[330px] flex items-center justify-center gap-4 rounded-xl shadow-xl border-2 ${
            theme.mode ? "bg-white" : "bg-[#3f3f3f]"
          } h-[200px]`}
        >
          <div className="p-4 rounded-lg bg-green-300">
            <GrNotes
              className={`${theme.mode ? "" : "text-black"}`}
              size={45}
            />
          </div>
          <div className="flex flex-col text-center">
            <span className="font-semibold text-sm">Tổng chi phí</span>
            <span className="font-bold text-2xl">
              {formatCostNumber(profit?.expense)}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 h-[500px]">
        <div className="col-span-2"></div>
        <div
          className={`col-span-2 flex flex-col bg-white shadow-xl rounded-xl border-2`}
        >
          <div className="px-3 flex flex-col items-center">
            <span className="border-b-2 text-gray-700 font-semibold p-3 w-full text-center">
              Biểu đồ doanh thu bán hàng
            </span>
          </div>
          <div id="income-chart" className="w-full my-auto">
            <Chart
              className="text-red"
              options={mixed}
              series={mixed.series}
              type="area"
              height={350}
            />
          </div>
        </div>
        {/* <div
          className={`col-span-1 flex flex-col bg-white shadow-xl rounded-xl border-2`}
        >
          <div className="px-3 flex flex-col items-center">
            <span className="border-b-2 text-gray-700 font-semibold p-3 w-full text-center">
              Tóm tắt doanh thu
            </span>
          </div>
          <div id="income-chart" className="w-full my-auto">
            <Chart
              className="text-red"
              options={mixed}
              series={mixed.series}
              type="area"
              height={350}
            />
          </div>
        </div> */}
      </div>
      <div className="w-full bg-white shadow-2xl rounded-xl mt-8">
        <div className="p-3 border-b-2">
          <span className="font-semibold text-gray-700">Sản phẩm đã bán</span>
        </div>
        <div>
          <DataTable columns={columns} data={topMenu} pagination />
        </div>
      </div>
    </div>
  );
});

export default Dashboard;
