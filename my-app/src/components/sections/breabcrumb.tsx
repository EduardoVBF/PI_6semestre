"use client";
import { ChevronRight, ChartColumn } from "lucide-react";
import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
  label: React.ReactNode | string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-gray-400 space-x-2">
      <Link
        href="/home"
        className="flex items-center gap-1 hover:text-white transition-colors"
      >
        <ChartColumn size={16} />
        <span>Dashboard</span>
      </Link>

      {items &&
        items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight size={14} className="text-white" />
            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-gray-200">
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </span>
            )}
          </div>
        ))}
    </nav>
  );
}
