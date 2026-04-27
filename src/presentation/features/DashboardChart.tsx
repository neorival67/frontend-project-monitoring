"use client";

/**
 * Smart Component: DashboardChart
 * Chart D3.js untuk visualisasi data dashboard proyek.
 * Akan dikembangkan lebih lanjut setelah referensi desain diterima.
 */

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface ChartData {
  label: string;
  value: number;
}

interface DashboardChartProps {
  data: ChartData[];
  width?: number;
  height?: number;
  title?: string;
}

export function DashboardChart({
  data,
  width = 500,
  height = 300,
  title,
}: DashboardChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Bersihkan chart sebelumnya
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scale
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) ?? 0])
      .nice()
      .range([innerHeight, 0]);

    // Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    svg.append("g").call(d3.axisLeft(yScale));

    // Bars
    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => xScale(d.label) ?? 0)
      .attr("y", innerHeight)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", "var(--color-foreground)")
      .attr("rx", 4)
      .transition()
      .duration(600)
      .attr("y", (d) => yScale(d.value))
      .attr("height", (d) => innerHeight - yScale(d.value));
  }, [data, width, height]);

  return (
    <div className="dashboard-chart">
      {title && <h3 className="chart-title">{title}</h3>}
      <svg ref={svgRef} className="w-full" />
    </div>
  );
}
