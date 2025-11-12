"use client";

import { Sparkles, FolderOpen, Package, ChevronLeft } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ activeSection, onSectionChange, isOpen, onToggle }: SidebarProps) {
  const items = [
    {
      id: "create",
      label: "Create Campaign",
      icon: Sparkles,
    },
    {
      id: "previous",
      label: "Previous Campaigns",
      icon: FolderOpen,
    },
    {
      id: "assets",
      label: "Brand Assets",
      icon: Package,
    },
  ];

  return (
    <aside
      className={`border-r border-border bg-sidebar flex flex-col transition-all ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
        {isOpen && (
          <div>
            <div className="text-2xl font-light tracking-wider text-sidebar-foreground">
              Lea Beauty
            </div>
            <p className="text-xs text-sidebar-foreground/60 mt-2">Campaign Studio</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-border p-1 rounded"
          title={isOpen ? "Collapse" : "Expand"}
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${!isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-border"
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon className="w-5 h-5" />
                  {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/60">
          <p>© 2025 Lea Beauty</p>
        </div>
      )}
    </aside>
  );
}
