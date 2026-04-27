"use client";

/**
 * Smart Component: DashboardOverview
 * Halaman utama dashboard dengan statistik, chart, dan ringkasan.
 * Menggunakan D3.js untuk bar chart, line chart, dan pie chart.
 */

import { useEffect, useRef, useCallback } from "react";
import { useDashboardSummary } from "@/use-cases/hooks";
import * as d3 from "d3";
import type { DashboardSummary } from "@/core/entities";

// ── Helper: format angka ke Rupiah ───────────────────────────────────
function formatRupiah(n: number): string {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)}Jt`;
  return `Rp ${n.toLocaleString("id-ID")}`;
}

// ══════════════════════════════════════════════════════════════════════
// LINE CHART — Aktivitas Progress
// ══════════════════════════════════════════════════════════════════════

function LineChart({ data }: { data: DashboardSummary }) {
  const ref = useRef<SVGSVGElement>(null);

  const draw = useCallback(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const container = ref.current.parentElement;
    const width = container?.clientWidth ?? 500;
    const height = 260;
    const margin = { top: 20, right: 20, bottom: 35, left: 45 };
    const iw = width - margin.left - margin.right;
    const ih = height - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Simulated monthly data from summary stats
    const { activityStats } = data;
    const total = activityStats.totalActivities || 1;
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
    const progressLine = months.map((_, i) => {
      const factor = (i + 1) / months.length;
      return Math.round(activityStats.averageProgress * factor * (0.8 + Math.random() * 0.4));
    });
    const completedLine = months.map((_, i) => {
      const factor = (i + 1) / months.length;
      return Math.round((activityStats.completedActivities / total) * 100 * factor);
    });

    const x = d3.scalePoint().domain(months).range([0, iw]).padding(0.3);
    const yMax = Math.max(100, d3.max([...progressLine, ...completedLine]) ?? 100);
    const y = d3.scaleLinear().domain([0, yMax]).nice().range([ih, 0]);

    // Grid
    g.append("g").attr("class", "grid")
      .call(d3.axisLeft(y).ticks(5).tickSize(-iw).tickFormat(() => ""))
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.06)"));

    // Axes
    g.append("g").attr("transform", `translate(0,${ih})`)
      .call(d3.axisBottom(x)).call((g) => g.select(".domain").attr("stroke", "rgba(255,255,255,0.1)"))
      .selectAll("text").attr("fill", "#64748b").attr("font-size", "11px");

    g.append("g").call(d3.axisLeft(y).ticks(5))
      .call((g) => g.select(".domain").remove())
      .selectAll("text").attr("fill", "#64748b").attr("font-size", "11px");

    // Line helper
    const line = (vals: number[]) =>
      d3.line<number>().x((_, i) => x(months[i])!).y((d) => y(d)).curve(d3.curveCardinal.tension(0.4))(vals);

    // Progress line
    g.append("path").datum(progressLine).attr("d", (d) => line(d))
      .attr("fill", "none").attr("stroke", "#6366f1").attr("stroke-width", 2.5)
      .attr("stroke-dasharray", function () { return this.getTotalLength(); })
      .attr("stroke-dashoffset", function () { return this.getTotalLength(); })
      .transition().duration(1200).attr("stroke-dashoffset", 0);

    // Completed line
    g.append("path").datum(completedLine).attr("d", (d) => line(d))
      .attr("fill", "none").attr("stroke", "#10b981").attr("stroke-width", 2.5)
      .attr("stroke-dasharray", function () { return this.getTotalLength(); })
      .attr("stroke-dashoffset", function () { return this.getTotalLength(); })
      .transition().duration(1200).delay(200).attr("stroke-dashoffset", 0);

    // Dots
    progressLine.forEach((v, i) => {
      g.append("circle").attr("cx", x(months[i])!).attr("cy", y(v)).attr("r", 3.5)
        .attr("fill", "#6366f1").attr("opacity", 0).transition().delay(1200).attr("opacity", 1);
    });
    completedLine.forEach((v, i) => {
      g.append("circle").attr("cx", x(months[i])!).attr("cy", y(v)).attr("r", 3.5)
        .attr("fill", "#10b981").attr("opacity", 0).transition().delay(1400).attr("opacity", 1);
    });
  }, [data]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  return (
    <div className="dash-chart-card dash-chart-wide">
      <div className="dash-chart-header">
        <h3 className="dash-chart-title">Progress Aktivitas</h3>
        <div className="dash-chart-legend">
          <span className="dash-legend-item"><span className="dash-legend-dot" style={{ background: "#6366f1" }} />Progress</span>
          <span className="dash-legend-item"><span className="dash-legend-dot" style={{ background: "#10b981" }} />Selesai</span>
        </div>
      </div>
      <svg ref={ref} className="dash-chart-svg" />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// BAR CHART — Status Proyek
// ══════════════════════════════════════════════════════════════════════

function BarChart({ data }: { data: DashboardSummary }) {
  const ref = useRef<SVGSVGElement>(null);

  const draw = useCallback(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const container = ref.current.parentElement;
    const width = container?.clientWidth ?? 400;
    const height = 260;
    const margin = { top: 20, right: 15, bottom: 35, left: 40 };
    const iw = width - margin.left - margin.right;
    const ih = height - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width} ${height}`);
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const { projectStats } = data;
    const items = [
      { label: "Berjalan", value: projectStats.inProgress, color: "#6366f1" },
      { label: "Selesai", value: projectStats.completed, color: "#10b981" },
      { label: "Terlambat", value: projectStats.delayed, color: "#ef4444" },
      { label: "Belum Mulai", value: projectStats.notStarted, color: "#64748b" },
    ];

    const x = d3.scaleBand().domain(items.map((d) => d.label)).range([0, iw]).padding(0.35);
    const yMax = Math.max(1, d3.max(items, (d) => d.value) ?? 1);
    const y = d3.scaleLinear().domain([0, yMax]).nice().range([ih, 0]);

    // Grid
    g.append("g")
      .call(d3.axisLeft(y).ticks(4).tickSize(-iw).tickFormat(() => ""))
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.06)"));

    g.append("g").attr("transform", `translate(0,${ih})`)
      .call(d3.axisBottom(x)).call((g) => g.select(".domain").attr("stroke", "rgba(255,255,255,0.1)"))
      .selectAll("text").attr("fill", "#64748b").attr("font-size", "11px");

    g.append("g").call(d3.axisLeft(y).ticks(4))
      .call((g) => g.select(".domain").remove())
      .selectAll("text").attr("fill", "#64748b").attr("font-size", "11px");

    // Bars with animation
    g.selectAll("rect").data(items).join("rect")
      .attr("x", (d) => x(d.label)!)
      .attr("width", x.bandwidth())
      .attr("y", ih).attr("height", 0).attr("rx", 6).attr("fill", (d) => d.color)
      .transition().duration(800).ease(d3.easeCubicOut)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => ih - y(d.value));

    // Value labels
    g.selectAll(".bar-label").data(items).join("text")
      .attr("x", (d) => x(d.label)! + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 8)
      .attr("text-anchor", "middle").attr("fill", "#94a3b8").attr("font-size", "12px").attr("font-weight", "600")
      .text((d) => d.value).attr("opacity", 0).transition().delay(800).attr("opacity", 1);
  }, [data]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  return (
    <div className="dash-chart-card">
      <div className="dash-chart-header">
        <h3 className="dash-chart-title">Status Proyek</h3>
      </div>
      <svg ref={ref} className="dash-chart-svg" />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// PIE CHART — Distribusi Risiko
// ══════════════════════════════════════════════════════════════════════

function PieChart({ data }: { data: DashboardSummary }) {
  const ref = useRef<SVGSVGElement>(null);

  const draw = useCallback(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const size = 260;
    const radius = 95;
    const innerRadius = 55;
    svg.attr("viewBox", `0 0 ${size} ${size}`);
    const g = svg.append("g").attr("transform", `translate(${size / 2},${size / 2})`);

    const { riskSummary } = data;
    const items = [
      { label: "Tinggi", value: riskSummary.highRisk, color: "#ef4444" },
      { label: "Sedang", value: riskSummary.mediumRisk, color: "#f59e0b" },
      { label: "Rendah", value: riskSummary.lowRisk, color: "#10b981" },
    ];

    // Avoid empty pie
    if (items.every((d) => d.value === 0)) {
      items[2].value = 1;
    }

    const pie = d3.pie<(typeof items)[0]>().value((d) => d.value).sort(null).padAngle(0.03);
    const arc = d3.arc<d3.PieArcDatum<(typeof items)[0]>>().innerRadius(innerRadius).outerRadius(radius).cornerRadius(4);

    // Arcs with animation
    g.selectAll("path").data(pie(items)).join("path")
      .attr("fill", (d) => d.data.color)
      .transition().duration(1000).ease(d3.easeCubicOut)
      .attrTween("d", function (d) {
        const interp = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return (t) => arc(interp(t)) ?? "";
      });

    // Center text
    g.append("text").attr("text-anchor", "middle").attr("dy", "-0.3em")
      .attr("fill", "#f1f5f9").attr("font-size", "22px").attr("font-weight", "700")
      .text(riskSummary.totalRisks);
    g.append("text").attr("text-anchor", "middle").attr("dy", "1.2em")
      .attr("fill", "#64748b").attr("font-size", "11px")
      .text("Total Risiko");
  }, [data]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  return (
    <div className="dash-chart-card">
      <div className="dash-chart-header">
        <h3 className="dash-chart-title">Distribusi Risiko</h3>
      </div>
      <div className="dash-pie-wrapper">
        <svg ref={ref} className="dash-chart-svg dash-pie-svg" />
        <div className="dash-pie-legend">
          <div className="dash-pie-legend-item"><span className="dash-legend-dot" style={{ background: "#ef4444" }} />Tinggi <strong>{data.riskSummary.highRisk}</strong></div>
          <div className="dash-pie-legend-item"><span className="dash-legend-dot" style={{ background: "#f59e0b" }} />Sedang <strong>{data.riskSummary.mediumRisk}</strong></div>
          <div className="dash-pie-legend-item"><span className="dash-legend-dot" style={{ background: "#10b981" }} />Rendah <strong>{data.riskSummary.lowRisk}</strong></div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════

export function DashboardOverview() {
  const { data, isLoading, isError } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="dash-loading">
        <div className="cv-spinner" />
        <span>Memuat dashboard...</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="dash-loading">
        <span className="cv-error-icon">⚠️</span>
        <p>Gagal memuat data dashboard. Silakan coba lagi.</p>
      </div>
    );
  }

  const projectStats = data.projectStats ?? { totalProjects: 0, inProgress: 0, completed: 0, delayed: 0, notStarted: 0 };
  const financialSummary = data.financialSummary ?? { totalBudget: 0, totalSpent: 0, remainingBudget: 0, budgetUtilization: 0 };
  const teamStats = data.teamStats ?? { totalUsers: 0, activeUsers: 0, pendingInvitations: 0 };
  const activityStats = data.activityStats ?? { totalActivities: 0, completedActivities: 0, inProgressActivities: 0, delayedActivities: 0, averageProgress: 0 };
  const deliverableStats = data.deliverableStats ?? { totalDeliverables: 0, approved: 0, rejected: 0, pending: 0 };
  const topRisks = data.topRisks ?? [];
  const upcomingDeadlines = data.upcomingDeadlines ?? [];

  // Build a safe data object for chart components
  const safeData: DashboardSummary = {
    projectStats,
    financialSummary,
    teamStats,
    riskSummary: data.riskSummary ?? { totalRisks: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0 },
    activityStats,
    deliverableStats,
    topRisks,
    upcomingDeadlines,
  };

  return (
    <div className="dash-overview">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="dash-page-header">
        <h1 className="dash-page-title">Overview Dashboard</h1>
        <p className="dash-page-subtitle">Ringkasan data proyek dan aktivitas</p>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────── */}
      <div className="dash-stats">
        <div className="dash-stat dash-stat-purple">
          <div className="dash-stat-top">
            <span className="dash-stat-icon-box">📁</span>
            <span className="dash-stat-change positive">Total</span>
          </div>
          <span className="dash-stat-val">{projectStats.totalProjects}</span>
          <span className="dash-stat-lbl">Proyek</span>
        </div>

        <div className="dash-stat dash-stat-green">
          <div className="dash-stat-top">
            <span className="dash-stat-icon-box">💰</span>
            <span className="dash-stat-change">{financialSummary.budgetUtilization}%</span>
          </div>
          <span className="dash-stat-val">{formatRupiah(financialSummary.totalBudget)}</span>
          <span className="dash-stat-lbl">Total Budget</span>
        </div>

        <div className="dash-stat dash-stat-blue">
          <div className="dash-stat-top">
            <span className="dash-stat-icon-box">👥</span>
            <span className="dash-stat-change positive">+{teamStats.pendingInvitations}</span>
          </div>
          <span className="dash-stat-val">{teamStats.activeUsers}</span>
          <span className="dash-stat-lbl">User Aktif</span>
        </div>

        <div className="dash-stat dash-stat-amber">
          <div className="dash-stat-top">
            <span className="dash-stat-icon-box">📊</span>
            <span className="dash-stat-change">{activityStats.averageProgress.toFixed(1)}%</span>
          </div>
          <span className="dash-stat-val">{activityStats.totalActivities}</span>
          <span className="dash-stat-lbl">Total Aktivitas</span>
        </div>
      </div>

      {/* ── Charts Row 1 ────────────────────────────────────────── */}
      <div className="dash-charts-row">
        <LineChart data={safeData} />
      </div>

      {/* ── Charts Row 2 ────────────────────────────────────────── */}
      <div className="dash-charts-row dash-charts-2col">
        <BarChart data={safeData} />
        <PieChart data={safeData} />
      </div>

      {/* ── Bottom Grid ─────────────────────────────────────────── */}
      <div className="dash-bottom-grid">
        {/* Financial summary */}
        <div className="dash-card">
          <h3 className="dash-card-title">Ringkasan Keuangan</h3>
          <div className="dash-finance-bars">
            <div className="dash-finance-item">
              <div className="dash-finance-label"><span>Terpakai</span><span>{formatRupiah(financialSummary.totalSpent)}</span></div>
              <div className="dash-progress-bar"><div className="dash-progress-fill dash-fill-purple" style={{ width: `${financialSummary.budgetUtilization}%` }} /></div>
            </div>
            <div className="dash-finance-item">
              <div className="dash-finance-label"><span>Sisa</span><span>{formatRupiah(financialSummary.remainingBudget)}</span></div>
              <div className="dash-progress-bar"><div className="dash-progress-fill dash-fill-green" style={{ width: `${100 - financialSummary.budgetUtilization}%` }} /></div>
            </div>
          </div>
          <div className="dash-deliverable-row">
            <span className="dash-del-label">Deliverable</span>
            <div className="dash-del-badges">
              <span className="dash-del-badge dash-del-approved">✓ {deliverableStats.approved}</span>
              <span className="dash-del-badge dash-del-pending">⏳ {deliverableStats.pending}</span>
              <span className="dash-del-badge dash-del-rejected">✕ {deliverableStats.rejected}</span>
            </div>
          </div>
        </div>

        {/* Upcoming deadlines */}
        <div className="dash-card">
          <h3 className="dash-card-title">Deadline Mendatang</h3>
          {upcomingDeadlines.length === 0 ? (
            <p className="dash-empty-text">Tidak ada deadline mendatang</p>
          ) : (
            <ul className="dash-deadline-list">
              {upcomingDeadlines.map((d) => (
                <li key={d.id} className="dash-deadline-item">
                  <div className="dash-deadline-info">
                    <span className="dash-deadline-name">{d.name}</span>
                    <span className={`dash-deadline-days ${d.daysLeft <= 3 ? "urgent" : ""}`}>
                      {d.daysLeft <= 0 ? "Hari ini" : `${d.daysLeft} hari lagi`}
                    </span>
                  </div>
                  <div className="dash-progress-bar dash-progress-sm">
                    <div className="dash-progress-fill dash-fill-purple" style={{ width: `${d.progress}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top risks */}
        <div className="dash-card">
          <h3 className="dash-card-title">Risiko Teratas</h3>
          {topRisks.length === 0 ? (
            <p className="dash-empty-text">Tidak ada risiko tinggi</p>
          ) : (
            <ul className="dash-risk-list">
              {topRisks.map((r) => (
                <li key={r.id} className="dash-risk-item">
                  <div className="dash-risk-score">{r.riskScore.toFixed(1)}</div>
                  <div className="dash-risk-info">
                    <span className="dash-risk-desc">{r.description}</span>
                    <span className="dash-risk-cat">{r.category}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
