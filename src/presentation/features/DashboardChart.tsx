"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

export interface ChartData {
  label: string;
  value1: number;
  value2: number;
  fullLabel?: string; 
}

interface DashboardChartProps {
  data: ChartData[];
  title?: string;
  label1?: string;
  label2?: string;
  color1?: string;
  color2?: string;
  valuePrefix?: string; // Contoh: "Rp "
  valueSuffix?: string; // Contoh: "Jt" atau "%"
  width?: number;
  height?: number;
}

export function DashboardChart({
  data,
  title,
  label1 = "Target",
  label2 = "Aktual",
  color1 = "#6366f1", 
  color2 = "#06b6d4", 
  valuePrefix = "",
  valueSuffix = "",
  width = 500,
  height = 300,
}: DashboardChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Bersihkan chart & tooltip lama biar gak numpuk pas re-render
    d3.select(svgRef.current).selectAll("*").remove();
    d3.selectAll(".chart-tooltip").remove();

    const margin = { top: 30, right: 20, bottom: 40, left: 65 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const groups = data.map((d) => d.label);
    const subGroups = ["value1", "value2"];

    const x = d3.scaleBand().domain(groups).range([0, innerWidth]).padding(0.2);
    const xSubgroup = d3.scaleBand().domain(subGroups).range([0, x.bandwidth()]).padding(0.1);

    const maxVal = d3.max(data, (d) => Math.max(d.value1, d.value2)) ?? 0;
    // Gunakan domain dinamis supaya tidak 0-10B saat data kecil
    const y = d3.scaleLinear().domain([0, maxVal > 0 ? maxVal : 1]).nice().range([innerHeight, 0]);
    const color = d3.scaleOrdinal<string>().domain(subGroups).range([color1, color2]);

    // Format helper: angka ke string pendek (M/B) sesuai konteks
    const formatTick = (val: number): string => {
      if (valueSuffix === "%") return `${val}%`;
      if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
      if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
      if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
      return `${val}`;
    };

    const formatTooltipVal = (val: number): string => {
      if (valueSuffix === "%") return `${val}${valueSuffix}`;
      if (val >= 1_000_000_000) return `${valuePrefix}${(val / 1_000_000_000).toFixed(2)}B`;
      if (val >= 1_000_000) return `${valuePrefix}${(val / 1_000_000).toFixed(2)}M`;
      if (val >= 1_000) return `${valuePrefix}${(val / 1_000).toFixed(0)}K`;
      return `${valuePrefix}${val}${valueSuffix}`;
    };

    // Gridlines horizontal
    svg.append("g")
      .attr("class", "grid")
      .style("stroke", "#e2e8f0")
      .style("stroke-dasharray", "4,4")
      .style("stroke-width", "0.5")
      .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(() => ""))
      .select(".domain").remove();

    svg.append("g")
      .attr("class", "text-slate-400 text-xs")
      .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0).tickFormat((d) => formatTick(d as number)))
      .select(".domain").remove();

    svg.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .attr("class", "text-slate-500 text-xs")
      .call(d3.axisBottom(x).tickSizeOuter(0));

    svg.selectAll(".tick line").attr("stroke", "#cbd5e1");
    svg.selectAll(".domain").attr("stroke", "#cbd5e1");
    svg.selectAll(".tick text").attr("fill", "#64748b").attr("font-size", "11px");

    // SETUP TOOLTIP
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "chart-tooltip")
      .style("position", "fixed")
      .style("display", "none")
      .style("background", "white")
      .style("border", "1px solid #e2e8f0")
      .style("box-shadow", "0 10px 30px rgba(0,0,0,0.12)")
      .style("border-radius", "10px")
      .style("padding", "10px 14px")
      .style("font-size", "12px")
      .style("z-index", "99999")
      .style("pointer-events", "none")
      .style("white-space", "nowrap")
      .style("opacity", "0")
      .style("transition", "opacity 0.15s ease");

    // RENDER BARS & ATTACH HOVER EVENTS
    const barGroups = svg.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${x(d.label)},0)`);

    barGroups.selectAll("rect")
      .data((d) => subGroups.map((key) => ({ key, value: d[key as keyof ChartData] as number, parentData: d })))
      .join("rect")
      .attr("x", (d) => xSubgroup(d.key) ?? 0)
      .attr("y", innerHeight)
      .attr("width", xSubgroup.bandwidth())
      .attr("height", 0)
      .attr("fill", (d) => color(d.key))
      .attr("rx", 3)
      .attr("ry", 3)
      .on("mouseover", function(event, d) {
        d3.select(this).style("filter", "brightness(1.15)");
        tooltip.style("display", "block").style("opacity", "1");
        tooltip.html(`
          <div style="font-weight:700;color:#1e293b;margin-bottom:6px;font-size:12px">
            ${d.parentData.fullLabel || d.parentData.label}
          </div>
          <div style="display:flex;align-items:center;gap:6px;color:#475569;font-size:11px">
            <span style="width:8px;height:8px;border-radius:50%;background:${color1};display:inline-block;flex-shrink:0"></span>
            ${label1}: <span style="color:${color1};font-weight:700;margin-left:4px">${formatTooltipVal(d.parentData.value1)}</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;margin-top:4px;color:#475569;font-size:11px">
            <span style="width:8px;height:8px;border-radius:50%;background:${color2};display:inline-block;flex-shrink:0"></span>
            ${label2}: <span style="color:${color2};font-weight:700;margin-left:4px">${formatTooltipVal(d.parentData.value2)}</span>
          </div>
        `);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", (event.clientX + 15) + "px")
          .style("top", (event.clientY - 40) + "px");
      })
      .on("mouseleave", function() {
        d3.select(this).style("filter", "none");
        tooltip.style("opacity", "0").style("display", "none");
      })
      .transition()
      .duration(800)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => innerHeight - y(d.value));

    return () => {
      d3.selectAll(".chart-tooltip").remove(); // Cleanup pas unmount
    };
  }, [data, width, height, color1, color2, label1, label2, valuePrefix, valueSuffix]);

  return (
    <div className="w-full flex flex-col items-center">
      {title && (
        <h3 className="w-full text-left text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
          {title}
        </h3>
      )}
      <svg ref={svgRef} className="w-full h-auto" />
      <div className="flex items-center gap-6 mt-4 text-sm font-medium text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: color1 }}></div>
          <span>{label1}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: color2 }}></div>
          <span>{label2}</span>
        </div>
      </div>
    </div>
  );
}