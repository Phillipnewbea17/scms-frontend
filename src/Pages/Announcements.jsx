import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  FiSearch,
  FiPlus,
  FiCalendar,
  FiStar,
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiX,
  FiUsers,
  FiCreditCard,
  FiHeart,
  FiVolume2,
} from "react-icons/fi";
import { BsPinAngleFill, BsPinAngle } from "react-icons/bs";
import "./Announcements.css";

/* ---------------------------------------------------------------- */
/* Mock data — swap for real API data                                */
/* ---------------------------------------------------------------- */

const ICONS = [FiUsers, FiCreditCard, FiCalendar, FiHeart, FiVolume2];

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Free Medical Check-up",
    date: "2026-08-15",
    description: "We are pleased to announce a free medical check-up for all senior citizens.",
    status: "Active",
    pinned: true,
    iconIndex: 4,
  },
  {
    id: 2,
    title: "Senior Citizens Assembly",
    date: "2026-08-20",
    description: "All senior citizens are invited to attend the assembly.",
    status: "Active",
    pinned: false,
    iconIndex: 0,
  },
  {
    id: 3,
    title: "Distribution of ID Cards",
    date: "2026-08-25",
    description: "ID cards are now ready for release. Please bring a valid ID.",
    status: "Active",
    pinned: false,
    iconIndex: 1,
  },
  {
    id: 4,
    title: "Nutrition Seminar",
    date: "2026-08-30",
    description: "Join us for a seminar about healthy living and nutrition.",
    status: "Active",
    pinned: false,
    iconIndex: 2,
  },
  {
    id: 5,
    title: "Blood Pressure Screening",
    date: "2026-09-05",
    description: "Free blood pressure screening for all senior citizens.",
    status: "Active",
    pinned: false,
    iconIndex: 3,
  },
];

const PAGE_SIZE = 4;
const SORT_OPTIONS = ["Newest First", "Oldest First"];

const EMPTY_FORM = { title: "", date: "", description: "" };

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

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

/* ---------------------------------------------------------------- */
/* Create / Edit modal                                                */
/* ---------------------------------------------------------------- */

function AnnouncementModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const isEdit = Boolean(initial);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;
    onSave(form);
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? "Edit Announcement" : "Create Announcement"}</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={submit} className="modal-form">
          <label className="field-label" htmlFor="ann-title">
            Title
          </label>
          <input
            id="ann-title"
            type="text"
            className="field-input"
            placeholder="e.g., Free Medical Check-up"
            value={form.title}
            onChange={update("title")}
            required
          />

          <label className="field-label" htmlFor="ann-date">
            Date
          </label>
          <input
            id="ann-date"
            type="date"
            className="field-input"
            value={form.date}
            onChange={update("date")}
            required
          />

          <label className="field-label" htmlFor="ann-desc">
            Description
          </label>
          <textarea
            id="ann-desc"
            className="field-textarea"
            placeholder="Describe the announcement..."
            value={form.description}
            onChange={update("description")}
            rows={4}
          />

          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEdit ? "Save Changes" : "Publish Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Main component                                                     */
/* ---------------------------------------------------------------- */

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest First");
  const [sortOpen, setSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState(null); // null | "create" | announcement object being edited

  const sortRef = useOutsideClose(() => setSortOpen(false));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  const pinned = announcements.find((a) => a.pinned) || null;

  const list = useMemo(() => {
    let items = announcements.filter((a) => !a.pinned);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter(
        (a) =>
          a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
      );
    }

    items = [...items].sort((a, b) => {
      const diff = new Date(a.date) - new Date(b.date);
      return sortBy === "Newest First" ? -diff : diff;
    });

    return items;
  }, [announcements, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const paginated = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const togglePin = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) => ({ ...a, pinned: a.id === id ? !a.pinned : false }))
    );
  };

  const toggleStatus = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === "Active" ? "Archived" : "Active" } : a
      )
    );
  };

  const deleteAnnouncement = (id) => {
    if (window.confirm("Delete this announcement? This cannot be undone.")) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleSave = (form) => {
    if (modalMode === "create") {
      const newItem = {
        id: Date.now(),
        title: form.title,
        date: form.date,
        description: form.description,
        status: "Active",
        pinned: false,
        iconIndex: Math.floor(Math.random() * ICONS.length),
      };
      setAnnouncements((prev) => [newItem, ...prev]);
    } else if (modalMode && modalMode.id) {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === modalMode.id ? { ...a, ...form } : a))
      );
    }
    setModalMode(null);
  };

  return (
    <div className="announcements">
      <div className="ann-heading">
        <div className="ann-heading-left">
          <span className="ann-heading-icon">
            <FiVolume2 />
          </span>
          <div>
            <h1>Announcements</h1>
            <p>Manage and publish announcements for senior citizens.</p>
          </div>
        </div>

        <div className="ann-heading-controls">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="button" className="btn-primary" onClick={() => setModalMode("create")}>
            <FiPlus /> Create Announcement
          </button>
        </div>
      </div>

      {pinned && (
        <div className="pinned-section">
          <h2 className="section-title">
            <BsPinAngleFill /> Pinned Announcement
          </h2>

          <div className="pinned-card">
            <div className="pinned-body">
              <span className="pinned-tag">
                <BsPinAngleFill /> PINNED
              </span>
              <h3>{pinned.title}</h3>
              <span className="pinned-date">
                <FiCalendar /> {formatDate(pinned.date)}
              </span>
              <p>{pinned.description}</p>
            </div>

            <div className="pinned-side">
              <button
                type="button"
                className={`status-badge ${pinned.status === "Active" ? "active" : "archived"}`}
                onClick={() => toggleStatus(pinned.id)}
              >
                <span className="status-dot" /> {pinned.status}
              </button>
              <button
                type="button"
                className="btn-outline btn-unpin"
                onClick={() => togglePin(pinned.id)}
              >
                <BsPinAngle /> Unpin Announcement
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="list-heading">
        <h2 className="section-title plain">All Announcements</h2>

        <div className="sort-wrap" ref={sortRef}>
          <button type="button" className="btn-outline" onClick={() => setSortOpen((o) => !o)}>
            Sort by: {sortBy}
            <FiChevronDown className={`chevron${sortOpen ? " open" : ""}`} />
          </button>
          {sortOpen && (
            <div className="dropdown-menu">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`dropdown-item${s === sortBy ? " active" : ""}`}
                  onClick={() => {
                    setSortBy(s);
                    setSortOpen(false);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="announcement-list">
        {paginated.map((a) => {
          const Icon = ICONS[a.iconIndex % ICONS.length];
          return (
            <div className="announcement-card" key={a.id}>
              <span className="announcement-icon">
                <Icon />
              </span>

              <div className="announcement-body">
                <h3>{a.title}</h3>
                <span className="announcement-date">
                  <FiCalendar /> {formatDate(a.date)}
                </span>
                <p>{a.description}</p>
              </div>

              <button
                type="button"
                className={`status-badge ${a.status === "Active" ? "active" : "archived"}`}
                onClick={() => toggleStatus(a.id)}
              >
                <span className="status-dot" /> {a.status}
              </button>

              <div className="announcement-actions">
                <button
                  type="button"
                  className="icon-square"
                  title="Pin announcement"
                  onClick={() => togglePin(a.id)}
                >
                  <FiStar />
                </button>
                <button
                  type="button"
                  className="icon-square edit"
                  title="Edit announcement"
                  onClick={() => setModalMode(a)}
                >
                  <FiEdit2 />
                </button>
                <button
                  type="button"
                  className="icon-square delete"
                  title="Delete announcement"
                  onClick={() => deleteAnnouncement(a.id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          );
        })}

        {paginated.length === 0 && (
          <div className="empty-state">No announcements match your search.</div>
        )}
      </div>

      <div className="ann-pagination">
        <span className="pagination-summary">
          Showing {list.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
          {Math.min(page * PAGE_SIZE, list.length)} of {list.length} announcements
        </span>
        <div className="pagination-controls">
          <button
            type="button"
            className="page-btn"
            disabled={page === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            &lsaquo;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              className={`page-btn${p === page ? " active" : ""}`}
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            className="page-btn"
            disabled={page === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            &rsaquo;
          </button>
        </div>
      </div>

      {modalMode && (
        <AnnouncementModal
          initial={modalMode === "create" ? null : modalMode}
          onClose={() => setModalMode(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
