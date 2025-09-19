"use client";

import { useEffect, useState } from "react";
import { SentimentChart } from "@/components/dashboard/sentiment-chart";
import { SuccessRateChart } from "@/components/dashboard/success-rate-chart";
import { LoadBookingChart } from "@/components/dashboard/load-booking-chart";
import { NegotiationChart } from "@/components/dashboard/negotiation-chart";
import { RecentCallsTable } from "@/components/dashboard/recent-calls-table";
import { toast } from "sonner";

export default function Dashboard() {
  const [callLogsData, setCallLogsData] = useState(null);
  const [loadsData, setLoadsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const apiKey = localStorage.getItem("freight_api_key");
    if (!apiKey) {
      toast.error("Please set your API key in Settings");
      setLoading(false);
      return;
    }

    try {
      const [callLogsResponse, loadsResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/call-logs-full`, {
          method: "GET",
          headers: {
            "X-API-Key": apiKey,
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/loads`, {
          method: "GET",
          headers: {
            "X-API-Key": apiKey,
          },
        })
      ]);

      if (!callLogsResponse.ok) {
        throw new Error("Failed to fetch call logs");
      }
      if (!loadsResponse.ok) {
        throw new Error("Failed to fetch loads");
      }

      const callLogsData = await callLogsResponse.json();
      const loadsData = await loadsResponse.json();

      setCallLogsData(callLogsData);
      setLoadsData(loadsData);
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
          <p className="text-sm text-muted-foreground">Powered by HappyRobot</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SentimentChart data={callLogsData} loading={loading} />
        <SuccessRateChart data={callLogsData} loading={loading} />
        <LoadBookingChart data={loadsData} loading={loading} />
        <NegotiationChart data={callLogsData} loading={loading} />
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