"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AdminCharts } from "@/lib/data/admin";

const BRAND = "#e11d48";
const GOLD = "#f59e0b";
const SKY = "#0ea5e9";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--color-border)",
  background: "var(--color-surface)",
  fontSize: 12,
} as const;

export function TopStoriesChart({ data }: { data: AdminCharts["topStories"] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeDasharray="4 4" />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="title"
          width={130}
          tick={{ fontSize: 11, fill: "var(--color-muted)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-surface-2)" }} />
        <Bar dataKey="reads" name="Leituras" fill={BRAND} radius={[0, 6, 6, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SignupsChart({ data }: { data: AdminCharts["signups"] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="signupsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SKY} stopOpacity={0.35} />
            <stop offset="100%" stopColor={SKY} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="4 4" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "var(--color-muted)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "var(--color-muted)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Area
          type="monotone"
          dataKey="count"
          name="Registos"
          stroke={SKY}
          strokeWidth={2}
          fill="url(#signupsGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RatingsChart({ data }: { data: AdminCharts["ratingsDistribution"] }) {
  const colors = ["#ef4444", "#f97316", GOLD, "#84cc16", "#10b981"];
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="rating"
          innerRadius={45}
          outerRadius={80}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.rating} fill={colors[(entry.rating - 1) % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(_value, name) => [`${name} estrelas`, "Avaliações"]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
