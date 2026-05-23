"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export interface ChartDataItem {
  name: string;
  budget: number;    
  realisasi: number; 
}

interface ProjectDetailsChartProps {
  data: ChartDataItem[];
}

export const ProjectDetailsChart: React.FC<ProjectDetailsChartProps> = ({ data }) => {
  const chartRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // Bersihkan SVG sebelum render ulang (mencegah duplikasi saat re-render)
    d3.select(chartRef.current).selectAll("*").remove();

    // Dimensi & Margin
    const margin = { top: 30, right: 30, bottom: 80, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    // Setup SVG
    const svg = d3
      .select(chartRef.current)
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Setup Scales
    const subgroups = ["budget", "realisasi"];
    const groups = data.map((d) => d.name);

    // Skala X (Untuk Kategori Aktivitas)
    const x = d3.scaleBand().domain(groups).range([0, width]).padding(0.2);

    // Skala X (Untuk Bar Budget vs Realisasi dalam satu kategori)
    const xSubgroup = d3.scaleBand().domain(subgroups).range([0, x.bandwidth()]).padding(0.05);

    // Skala Y (Mencari nilai tertinggi untuk batas atas Y-axis)
    const maxValue = d3.max(data, (d) => Math.max(d.budget, d.realisasi)) || 100;
    const y = d3.scaleLinear().domain([0, maxValue * 1.1]).range([height, 0]);

    // Warna
    const color = d3.scaleOrdinal<string>().domain(subgroups).range(["#3b82f6", "#10b981"]); // Blue-500 & Emerald-500

    // Gridlines Horizontal
    svg.append("g")
      .attr("class", "grid text-slate-200 stroke-dasharray-[4_4]")
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => "").ticks(5))
      .select(".domain").remove();

    // Axes (Sumbu X & Y)
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-25)")
      .style("text-anchor", "end")
      .attr("class", "text-[11px] text-slate-500 font-medium")
      // Truncate text jika terlalu panjang
      .text(function(d) {
        if (!d) return "-"; // Jika datanya undefined/null, kembalikan strip
        const txt = String(d); // Paksa ubah menjadi tipe data String
        return txt.length > 15 ? txt.substring(0, 15) + "..." : txt;
      });

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .attr("class", "text-[11px] text-slate-500 font-medium")
      .select(".domain").remove(); // Hilangkan garis vertikal Y

    // Tooltip Element
    const tooltip = d3.select(tooltipRef.current);

    // Membuat Bar Groups
    svg.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${x(d.name)},0)`)
      .selectAll("rect")
      .data((d) => subgroups.map((key) => ({ key, value: d[key as keyof ChartDataItem] as number, data: d })))
      .join("rect")
      .attr("x", (d) => xSubgroup(d.key)!)
      .attr("y", (d) => y(d.value))
      .attr("width", xSubgroup.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d) => color(d.key))
      .attr("rx", 2) // Border radius atas
      // Event Listener Tooltip
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8);
        tooltip
          .style("opacity", 1)
          .html(`
            <div class="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-2">${d.data.name}</div>
            <div class="flex items-center gap-2 text-blue-600 text-sm font-semibold">
              <div class="w-3 h-3 bg-blue-500 rounded-sm"></div> Budget: Rp ${d.data.budget.toFixed(1)}Jt
            </div>
            <div class="flex items-center gap-2 text-emerald-600 text-sm font-semibold mt-1">
              <div class="w-3 h-3 bg-emerald-500 rounded-sm"></div> Realisasi: Rp ${d.data.realisasi.toFixed(1)}Jt
            </div>
          `);
      })
      .on("mousemove", function (event) {
        const [xPos, yPos] = d3.pointer(event, chartRef.current?.parentElement);
        tooltip
          .style("left", `${xPos + 15}px`)
          .style("top", `${yPos - 30}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        tooltip.style("opacity", 0);
      });

  }, [data]);

  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* Tooltip Container (Absolute) */}
      <div
        ref={tooltipRef}
        className="absolute z-10 bg-white border border-slate-200 shadow-xl rounded-xl p-4 pointer-events-none opacity-0 transition-opacity duration-200 min-w-[200px]"
        style={{ top: 0, left: 0 }}
      ></div>
      
      {/* SVG Chart */}
      <svg ref={chartRef} className="w-full h-auto min-h-[350px]"></svg>

      {/* Custom Legend */}
      <div className="flex justify-center gap-6 mt-2 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <div className="w-4 h-4 bg-blue-500 rounded"></div> Budget
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <div className="w-4 h-4 bg-emerald-500 rounded"></div> Realisasi
        </div>
      </div>
    </div>
  );
};