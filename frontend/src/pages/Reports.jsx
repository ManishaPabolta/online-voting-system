import DashboardLayout from "../layouts/DashboardLayout";

import ReportChart from "../components/dashboard/ReportChart";

const Reports = () => {
  return (
    <DashboardLayout>

      <div className="mb-10">

        <h1 className="text-5xl font-black">
          Election Reports
        </h1>

        <p className="text-gray-400 mt-3">
          Analytics & voting
          statistics
        </p>

      </div>

      <ReportChart />

    </DashboardLayout>
  );
};

export default Reports;