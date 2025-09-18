"use client";

import { useEffect, useState } from "react";
import { SentimentChart } from "@/components/dashboard/sentiment-chart";
import { SuccessRateChart } from "@/components/dashboard/success-rate-chart";
import { RecentCallsTable } from "@/components/dashboard/recent-calls-table";

export default function Dashboard() {
  const [callLogsData, setCallLogsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const apiKey = localStorage.getItem("freight_api_key");
    if (!apiKey) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/call-logs-full", {
        method: "GET",
        headers: {
          "X-API-Key": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch call logs");
      }

      const data = await response.json();
      setCallLogsData(data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <SentimentChart data={callLogsData} loading={loading} />
        <SuccessRateChart data={callLogsData} loading={loading} />
      </div>

      <RecentCallsTable data={callLogsData} loading={loading} />

      {/* 
      ideas: 
      - que loads son las mas solicitadas, por numero de llamadas
      - que loads son las mas rechazadas por precio alto
      - bar chart o similar de bookings cerrados por dia
      - popular routes
      */}
    </div>
  );
}