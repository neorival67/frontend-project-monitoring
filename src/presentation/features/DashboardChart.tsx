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

    const margin = { top: 30, right: 20, bottom: 40, left: 50 };
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
    const y = d3.scaleLinear().domain([0, maxVal]).nice().range([innerHeight, 0]);
    const color = d3.scaleOrdinal<string>().domain(subGroups).range([color1, color2]);

    // Gridlines horizontal
    svg.append("g")
      .attr("class", "grid text-slate-100 dark:text-slate-800/50 stroke-dasharray-4")
      .style("stroke-dasharray", "4,4") // Efek garis putus-putus
      .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(() => ""))
      .select(".domain").remove();

    svg.append("g")
      .attr("class", "text-slate-400 dark:text-slate-500 text-xs")
      .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0))
      .select(".domain").remove();

    svg.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .attr("class", "text-slate-500 dark:text-slate-400 text-xs")
      .call(d3.axisBottom(x).tickSizeOuter(0));

    svg.selectAll(".tick line").attr("stroke", "currentColor");
    svg.selectAll(".domain").attr("stroke", "currentColor");

    // SETUP TOOLTIP
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "chart-tooltip absolute hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-lg p-3 text-sm z-50 pointer-events-none transition-opacity duration-200")
      .style("opacity", 0);

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
        d3.select(this).style("filter", "brightness(1.1)"); // Efek terang pas di-hover
        tooltip.classed("hidden", false).style("opacity", 1);
        
        // Desain HTML Tooltip mirip screenshot lu
        tooltip.html(`
          <div class="font-medium text-slate-800 dark:text-slate-200 mb-2">
            ${d.parentData.fullLabel || d.parentData.label}
          </div>
          <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span class="w-2 h-2 rounded-full" style="background:${color1}"></span>
            ${label1}: <span style="color:${color1}" class="font-medium">${valuePrefix}${d.parentData.value1}${valueSuffix}</span>
          </div>
          <div class="flex items-center gap-2 mt-1 text-slate-600 dark:text-slate-300">
            <span class="w-2 h-2 rounded-full" style="background:${color2}"></span>
            ${label2}: <span style="color:${color2}" class="font-medium">${valuePrefix}${d.parentData.value2}${valueSuffix}</span>
          </div>
        `);
      })
      .on("mousemove", (event) => {
        // Posisi tooltip ngikutin mouse
        tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 30) + "px");
      })
      .on("mouseleave", function() {
        d3.select(this).style("filter", "none");
        tooltip.style("opacity", 0).on("end", () => tooltip.classed("hidden", true));
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