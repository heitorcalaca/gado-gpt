import { useState } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker"; // Adicione a biblioteca react-datepicker se necessário
import "react-datepicker/dist/react-datepicker.css";

export default function DashboardHeader() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <header className="bg-white shadow mb-6">
      <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Título do Dashboard */}
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Visão Geral do Rebanho
        </h1>

        {/* Seletor de Data */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Data Inicial</label>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              className="border border-gray-300 rounded-md p-2 z-10"
              placeholderText="Selecione a data inicial"
              dateFormat="dd/MM/yyyy"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Data Final</label>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              className="border border-gray-300 rounded-md p-2 z-10"
              placeholderText="Selecione a data final"
              dateFormat="dd/MM/yyyy"
            />
          </div>

          {/* Exibe a data atual */}
          <div className="text-gray-600">
            {`Data Atual: ${format(new Date(), "dd/MM/yyyy")}`}
          </div>
        </div>
      </div>
    </header>
  );
}
