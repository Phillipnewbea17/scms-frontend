import React, { useState, useRef, useEffect } from "react";
import {
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
  FiVolume2,
  FiHeart,
  FiCalendar,
  FiChevronDown,
  FiInfo,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { BsPinAngleFill } from "react-icons/bs";
import { PiCakeDuotone } from "react-icons/pi";
import "./Dashboard.css";

/* ---------------------------------------------------------------- */
/* Mock data — swap these for real API data                          */
/* ---------------------------------------------------------------- */

const STATS = [
  {
    key: "total",
    label: "Total Applicants",
    value: 1248,
    sublabel: "All time total",
    trend: { value: "8.5%", up: true },
    icon: FiUsers,
    tone: "green",
  },
  {
    key: "pending",
    label: "Pending",
    value: 126,
    sublabel: "For verification",
    trend: { value: "3.4%", up: true },
    icon: FiClock,
    tone: "amber",
  },
  {
    key: "verified",
    label: "Verified",
    value: 1032,
    sublabel: "Approved applicants",
    trend: { value: "7.8%", up: true },
    icon: FiCheckCircle,
    tone: "green",
  },
  {
    key: "rejected",
    label: "Rejected",
    value: 90,
    sublabel: "Rejected applications",
    trend: { value: "2.1%", up: false },
    icon: FiXCircle,
    tone: "red",
  },
];

const RECENT_APPLICANTS = [
  { id: 1, name: "Juan Dela Cruz", date: "July 25, 2026", time: "10:45 AM", status: "Pending" },
  { id: 2, name: "Maria Santos", date: "July 25, 2026", time: "09:30 AM", status: "Pending" },
  { id: 3, name: "Pedro Reyes", date: "July 24, 2026", time: "04:15 PM", status: "Verified" },
  { id: 4, name: "Andrea Gonzales", date: "July 24, 2026", time: "11:20 AM", status: "Verified" },
  { id: 5, name: "Ramon Bautista", date: "July 23, 2026", time: "02:05 PM", status: "Rejected" },
];

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Free Medical Check-up",
    date: "August 15, 2026",
    description:
      "We are pleased to announce a free medical check-up for all senior citizens.",
    pinned: true,
  },
  { id: 2, title: "Senior Citizens Assembly", date: "August 20, 2026" },
  { id: 3, title: "Distribution of ID Cards", date: "August 25, 2026" },
  { id: 4, title: "Nutrition Seminar", date: "August 30, 2026" },
];

const BIRTHDAYS = [
  { id: 1, name: "Teresa Ramirez", date: "July 26, 1954", age: 72, note: "Birthday Tomorrow" },
  { id: 2, name: "Ricardo Lim", date: "July 30, 1949", age: 77, note: "Birthday in 5 days" },
  { id: 3, name: "Elena Cruz", date: "August 2, 1944", age: 82, note: "Birthday in 5 days" },
];

const ANNIVERSARIES = [
  { id: 1, title: "85th Anniversary", names: "Soledad Reyes", date: "July 28, 2026" },
  { id: 2, title: "50th Anniversary", names: "Benjamin & Rosario Santos", date: "July 30, 2026" },
  { id: 3, title: "60th Anniversary", names: "Pedro & Milagros Dela Cruz", date: "August 5, 2026" },
];

/* Application statistics per period, used to drive the donut chart */
const APPLICATION_STATS = {
  "This Month": { newRegistrations: 156, verified: 102, pending: 54, insight: 12.6 },
  "Last Month": { newRegistrations: 139, verified: 89, pending: 50, insight: 4.1 },
};

const DATE_OPTIONS = ["July 25, 2026", "July 24, 2026", "July 23, 2026", "July 22, 2026"];

/* ---------------------------------------------------------------- */
/* Small reusable bits                                               */
/* ---------------------------------------------------------------- */

function StatCard({ icon: Icon, label, value, sublabel, trend, tone }) {
  return (
    <div className="stat-card">
      <span className={`stat-icon tone-${tone}`}>
        <Icon />
      </span>
      <div className="stat-body">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value.toLocaleString()}</span>
        <span className="stat-sublabel">{sublabel}</span>
        <span className={`stat-trend ${trend.up ? "up" : "down"}`}>
          {trend.up ? <FiArrowUp /> : <FiArrowDown />}
          {trend.value}
          <span className="stat-trend-text">vs last month</span>
        </span>
      </div>
    </div>
  );
}

const STATUS_CLASS = {
  Pending: "badge-amber",
  Verified: "badge-green",
  Rejected: "badge-red",
};

function useOutsideClose(onClose) {
  const ref = useRef(null);
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return ref;
}

/* Donut chart built with plain SVG stroke-dasharray segments — no chart library needed */
function DonutChart({ verified, pending, total }) {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const verifiedPct = verified / total;
  const pendingPct = pending / total;

  const verifiedLen = circumference * verifiedPct;
  const pendingLen = circumference * pendingPct;

  return (
    <svg viewBox="0 0 160 160" className="donut-svg">
      <circle cx="80" cy="80" r={radius} className="donut-track" />
      {/* Blue = verified */}
      <circle
        cx="80"
        cy="80"
        r={radius}
        className="donut-segment donut-blue"
        strokeDasharray={`${verifiedLen} ${circumference - verifiedLen}`}
        strokeDashoffset={0}
      />
      {/* Yellow = pending, starts right after the verified segment */}
      <circle
        cx="80"
        cy="80"
        r={radius}
        className="donut-segment donut-yellow"
        strokeDasharray={`${pendingLen} ${circumference - pendingLen}`}
        strokeDashoffset={-verifiedLen}
      />
      <text x="80" y="70" textAnchor="middle" className="donut-center-label">
        This Month
      </text>
      <text x="80" y="96" textAnchor="middle" className="donut-center-value">
        {total}
      </text>
      <text x="80" y="112" textAnchor="middle" className="donut-center-label">
        Total
      </text>
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* Main Dashboard component                                          */
/* ---------------------------------------------------------------- */

export default function Dashboard({
  onViewAllApplicants,
  onViewAllAnnouncements,
  onViewAllBirthdays,
  onViewAllAnniversaries,
  onSelectApplicant,
}) {
  const [selectedDate, setSelectedDate] = useState(DATE_OPTIONS[0]);
  const [dateOpen, setDateOpen] = useState(false);
  const dateRef = useOutsideClose(() => setDateOpen(false));

  const [period, setPeriod] = useState("This Month");
  const [periodOpen, setPeriodOpen] = useState(false);
  const periodRef = useOutsideClose(() => setPeriodOpen(false));

  const stats = APPLICATION_STATS[period];
  const totalThisPeriod = stats.newRegistrations;

  return (
    <div className="dashboard">
      {/* Page heading + date filter */}
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of senior citizen applications and system updates.</p>
        </div>

        <div className="date-picker" ref={dateRef}>
          <button
            type="button"
            className="date-picker-btn"
            onClick={() => setDateOpen((o) => !o)}
          >
            <FiCalendar />
            <span>{selectedDate}</span>
            <FiChevronDown className={`chevron${dateOpen ? " open" : ""}`} />
          </button>
          {dateOpen && (
            <div className="dropdown-menu">
              {DATE_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`dropdown-item${d === selectedDate ? " active" : ""}`}
                  onClick={() => {
                    setSelectedDate(d);
                    setDateOpen(false);
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        {STATS.map((s) => (
          <StatCard key={s.key} {...s} />
        ))}
      </div>

      {/* Row 1: Recent applicants / Application statistics / Announcements */}
      <div className="dashboard-row row-3">
        <section className="panel">
          <div className="panel-header">
            <h2>
              <FiUsers className="panel-header-icon" />
              Recent Applicants
            </h2>
            <button
              type="button"
              className="btn-outline btn-sm"
              onClick={onViewAllApplicants}
            >
              View All
            </button>
          </div>

          <div className="applicant-list">
            {RECENT_APPLICANTS.map((a) => (
              <button
                key={a.id}
                type="button"
                className="applicant-row"
                onClick={() => onSelectApplicant && onSelectApplicant(a)}
              >
                <span className="applicant-avatar">
                  <FiUsers />
                </span>
                <span className="applicant-info">
                  <span className="applicant-name">{a.name}</span>
                  <span className="applicant-meta">
                    {a.date} &bull; {a.time}
                  </span>
                </span>
                <span className={`badge ${STATUS_CLASS[a.status]}`}>{a.status}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn-block"
            onClick={onViewAllApplicants}
          >
            View All Applicants
          </button>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>
              <FiTrendingUp className="panel-header-icon" />
              Application Statistics
            </h2>
            <div className="period-picker" ref={periodRef}>
              <button
                type="button"
                className="date-picker-btn small"
                onClick={() => setPeriodOpen((o) => !o)}
              >
                <span>{period}</span>
                <FiChevronDown className={`chevron${periodOpen ? " open" : ""}`} />
              </button>
              {periodOpen && (
                <div className="dropdown-menu">
                  {Object.keys(APPLICATION_STATS).map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`dropdown-item${p === period ? " active" : ""}`}
                      onClick={() => {
                        setPeriod(p);
                        setPeriodOpen(false);
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="donut-wrapper">
            <DonutChart
              verified={stats.verified}
              pending={stats.pending}
              total={totalThisPeriod}
            />

            <div className="donut-legend">
              <div className="legend-item">
                <span className="legend-dot dot-green" />
                <span className="legend-text">
                  <span className="legend-label">New Registrations</span>
                  <span className="legend-value">{stats.newRegistrations}</span>
                </span>
                <span className="legend-trend up">
                  <FiArrowUp /> 12.6%
                </span>
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-blue" />
                <span className="legend-text">
                  <span className="legend-label">Verified</span>
                  <span className="legend-value">{stats.verified}</span>
                </span>
                <span className="legend-trend up">
                  <FiArrowUp /> 8.3%
                </span>
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-yellow" />
                <span className="legend-text">
                  <span className="legend-label">Pending</span>
                  <span className="legend-value">{stats.pending}</span>
                </span>
                <span className="legend-trend down">
                  <FiArrowDown /> 4.7%
                </span>
              </div>
            </div>
          </div>

          <div className="insight-box">
            <FiInfo />
            <span>
              There is an increase of {stats.insight}% in new registrations compared
              to last month.
            </span>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>
              <FiVolume2 className="panel-header-icon" />
              Announcements
            </h2>
            <button
              type="button"
              className="btn-outline btn-sm"
              onClick={onViewAllAnnouncements}
            >
              View All
            </button>
          </div>

          <div className="announcement-list">
            {ANNOUNCEMENTS.map((a) =>
              a.pinned ? (
                <div key={a.id} className="pinned-announcement">
                  <div className="pinned-label">
                    <BsPinAngleFill /> Pinned Announcement
                  </div>
                  <h3>{a.title}</h3>
                  <span className="pinned-date">{a.date}</span>
                  <p>{a.description}</p>
                  <BsPinAngleFill className="pin-corner" />
                </div>
              ) : (
                <div key={a.id} className="announcement-row">
                  <span className="announcement-title">{a.title}</span>
                  <span className="announcement-date">{a.date}</span>
                </div>
              )
            )}
          </div>
        </section>
      </div>

      {/* Row 2: Birthday list / Anniversary reminder */}
      <div className="dashboard-row row-2">
        <section className="panel">
          <div className="panel-header">
            <h2>
              <PiCakeDuotone className="panel-header-icon" />
              Birthday List
            </h2>
            <button
              type="button"
              className="btn-outline btn-sm"
              onClick={onViewAllBirthdays}
            >
              View All
            </button>
          </div>

          <div className="birthday-grid">
            {BIRTHDAYS.map((b) => (
              <div key={b.id} className="birthday-card">
                <span className="birthday-avatar">
                  <FiUsers />
                </span>
                <span className="birthday-name">{b.name}</span>
                <span className="birthday-date">
                  {b.date} &nbsp;({b.age})
                </span>
                <span className="birthday-note">
                  <PiCakeDuotone /> {b.note}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>
              <FiHeart className="panel-header-icon" />
              Anniversary Reminder
            </h2>
            <button
              type="button"
              className="btn-outline btn-sm"
              onClick={onViewAllAnniversaries}
            >
              View All
            </button>
          </div>

          <div className="anniversary-list">
            {ANNIVERSARIES.map((a) => (
              <div key={a.id} className="anniversary-row">
                <span className="anniversary-icon">
                  <FiHeart />
                </span>
                <span className="anniversary-info">
                  <span className="anniversary-title">{a.title}</span>
                  <span className="anniversary-meta">
                    {a.names} &bull; {a.date}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
