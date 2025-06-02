"use client"

import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface TemperatureChartProps {
  title?: string
  minTemp?: number
  maxTemp?: number
  criticalLow?: number
  criticalHigh?: number
}

export function TemperatureChart({
  title = "Temperature Monitoring",
  minTemp = 2,
  maxTemp = 8,
  criticalLow = 0,
  criticalHigh = 10,
}: TemperatureChartProps) {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h")

  // Generate sample data based on time range
  const generateData = () => {
    const now = new Date()
    const labels: string[] = []
    const temperatures: number[] = []
    const humidity: number[] = []

    let dataPoints = 24
    let interval = 60 // minutes

    if (timeRange === "7d") {
      dataPoints = 7
      interval = 24 * 60 // daily
    } else if (timeRange === "30d") {
      dataPoints = 30
      interval = 24 * 60 // daily
    }

    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * interval * 60000)

      if (timeRange === "24h") {
        labels.push(date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
      } else {
        labels.push(date.toLocaleDateString([], { month: "short", day: "numeric" }))
      }

      // Generate random temperature within range with occasional spikes
      const baseTemp = minTemp + Math.random() * (maxTemp - minTemp)
      const spike = Math.random() > 0.95 ? (Math.random() > 0.5 ? 3 : -3) : 0
      temperatures.push(Number((baseTemp + spike).toFixed(1)))

      // Generate random humidity between 30-60%
      humidity.push(Math.floor(30 + Math.random() * 30))
    }

    return { labels, temperatures, humidity }
  }

  const [chartData, setChartData] = useState(generateData())

  useEffect(() => {
    setChartData(generateData())
  }, [timeRange])

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: chartData.temperatures,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
      },
      {
        label: "Humidity (%)",
        data: chartData.humidity,
        borderColor: "rgb(107, 114, 128)",
        backgroundColor: "rgba(107, 114, 128, 0.5)",
        tension: 0.3,
        yAxisID: "y1",
      },
    ],
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        min: criticalLow - 2,
        max: criticalHigh + 2,
        title: {
          display: true,
          text: "Temperature (°C)",
        },
      },
      y1: {
        position: "right" as const,
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Humidity (%)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        title: {
          display: true,
          text: timeRange === "24h" ? "Time" : "Date",
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant={timeRange === "24h" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("24h")}
            className="h-8 text-xs"
          >
            24h
          </Button>
          <Button
            variant={timeRange === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("7d")}
            className="h-8 text-xs"
          >
            7d
          </Button>
          <Button
            variant={timeRange === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("30d")}
            className="h-8 text-xs"
          >
            30d
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line options={options} data={data} />
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="mr-1 h-3 w-3 rounded-full bg-green-500"></div>
              <span>
                Normal Range: {minTemp}°C - {maxTemp}°C
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="mr-1 h-3 w-3 rounded-full bg-destructive"></div>
              <span>
                Critical: &lt;{criticalLow}°C or &gt;{criticalHigh}°C
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
