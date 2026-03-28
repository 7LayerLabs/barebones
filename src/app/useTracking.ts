"use client";

import { useEffect, useRef } from "react";
import { db, id } from "./instant";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let vid = localStorage.getItem("barebone_vid");
  if (!vid) {
    vid = crypto.randomUUID();
    localStorage.setItem("barebone_vid", vid);
  }
  return vid;
}

export function useTrackVisitor() {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const visitorId = getVisitorId();
    if (!visitorId) return;

    const now = Date.now();

    // Upsert visitor — update lastSeen, set firstSeen only on creation
    db.transact(
      db.tx.visitors[id()].update({
        visitorId,
        firstSeen: now,
        lastSeen: now,
      })
    );
  }, []);
}

export function trackBreakdown(idea: string) {
  const visitorId = getVisitorId();
  db.transact(
    db.tx.breakdowns[id()].update({
      idea,
      visitorId,
      createdAt: Date.now(),
    })
  );
}

export function useStats() {
  const visitorsQuery = db.useQuery({ visitors: {} });
  const breakdownsQuery = db.useQuery({ breakdowns: {} });

  const totalVisitors = visitorsQuery.data?.visitors?.length ?? 0;
  const totalBreakdowns = breakdownsQuery.data?.breakdowns?.length ?? 0;

  return {
    totalVisitors,
    totalBreakdowns,
    loading: visitorsQuery.isLoading || breakdownsQuery.isLoading,
  };
}
