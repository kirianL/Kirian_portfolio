import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Github } from "lucide-react";

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

const MONTHS_ES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];
const DAYS_SHORT = ["D", "L", "M", "M", "J", "V", "S"];

export function GithubActivity() {
  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  useEffect(() => {
    async function fetchData() {
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      const username = import.meta.env.VITE_GITHUB_USERNAME || "kirianL";

      if (!token) {
        console.warn(
          "GitHub Activity: VITE_GITHUB_TOKEN is missing in environment.",
        );
        setData(generateMockData());
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                user(login: "${username}") {
                  contributionsCollection {
                    contributionCalendar {
                      totalContributions
                      weeks {
                        contributionDays {
                          contributionCount
                          date
                        }
                      }
                    }
                  }
                }
              }
            `,
          }),
        });

        if (!res.ok) {
          throw new Error(
            `GitHub API returned ${res.status}: ${res.statusText}`,
          );
        }

        const json = await res.json();
        if (json.errors) {
          throw new Error(json.errors[0].message);
        }

        const calendar =
          json.data?.user?.contributionsCollection?.contributionCalendar;
        if (!calendar) {
          throw new Error("No contribution calendar data found in response");
        }

        setData({
          totalContributions: calendar.totalContributions,
          weeks: calendar.weeks,
        });
      } catch (err) {
        // Log more helpful error but don't break the UI
        console.groupCollapsed("GitHub Activity Fetch Status");
        console.info("Falling back to local mock data due to fetch failure.");
        console.debug("Error Detail:", err);
        console.groupEnd();

        setData(generateMockData());
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const { weeksYear, totalYear, monthLabels } = useMemo(() => {
    if (!data) return { weeksYear: [], totalYear: 0, monthLabels: [] };

    const currentYear = new Date().getFullYear();
    let curr = new Date(`${currentYear}-01-01T12:00:00`);
    const end = new Date(`${currentYear}-12-31T12:00:00`);

    const dataMap = new Map<string, number>();
    data.weeks.forEach((w) =>
      w.contributionDays.forEach((d) =>
        dataMap.set(d.date, d.contributionCount),
      ),
    );

    // Adjust to start of week (Sunday)
    while (curr.getDay() !== 0) {
      curr.setDate(curr.getDate() - 1);
    }

    const weeks: ContributionWeek[] = [];
    let total = 0;
    const months: { label: string; index: number }[] = [];
    let lastMonth = -1;

    // Show at least 52 weeks
    while (curr <= end || weeks.length < 52) {
      const weekDays: ContributionDay[] = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = curr.toISOString().split("T")[0];
        const count = dataMap.get(dateStr) || 0;

        if (curr.getFullYear() === currentYear) {
          total += count;
          // Label month if it's the first week of that month
          if (curr.getMonth() !== lastMonth && curr.getDate() <= 7) {
            months.push({
              label: MONTHS_ES[curr.getMonth()],
              index: weeks.length,
            });
            lastMonth = curr.getMonth();
          }
        }
        weekDays.push({ contributionCount: count, date: dateStr });
        curr.setDate(curr.getDate() + 1);
      }
      weeks.push({ contributionDays: weekDays });
      if (curr.getFullYear() > currentYear && weeks.length >= 52) break;
    }

    return { weeksYear: weeks, totalYear: total, monthLabels: months };
  }, [data]);

  if (loading)
    return (
      <div className="w-full h-48 animate-pulse bg-secondary/20 rounded-xl" />
    );
  if (!data) return null;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2 font-heal tracking-wide">
            <Github className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            Actividad de GitHub
          </h3>
          <div className="text-xs sm:text-sm text-muted-foreground/80 flex items-center h-6 min-w-0">
            <span className="shrink-0">
              {totalYear} contribuciones en {new Date().getFullYear()}
            </span>
            <div className="flex-1 ml-3 border-l border-border pl-3 overflow-visible h-full flex items-center">
              <AnimatePresence mode="popLayout">
                {hoveredDay && (
                  <motion.div
                    key={hoveredDay.date}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.1 }}
                    className="text-foreground font-medium flex items-center whitespace-nowrap"
                  >
                    <span className="capitalize">
                      {new Date(
                        hoveredDay.date + "T12:00:00",
                      ).toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    {hoveredDay.contributionCount > 0 && (
                      <span className="ml-2 text-emerald-500 dark:text-emerald-400 font-bold">
                        • {hoveredDay.contributionCount}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground bg-secondary/30 px-3 py-1 rounded-full border border-border/50 self-start sm:self-center">
          <span>Menos</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((lvl) => (
              <div
                key={lvl}
                className={cn("w-2.5 h-2.5 rounded-[2px]", getColorLevel(lvl))}
              />
            ))}
          </div>
          <span>Más</span>
        </div>
      </div>

      <div className="w-full relative group rounded-2xl border border-border/60 dark:border-white/5 bg-secondary/10 dark:bg-black/20 p-3 sm:p-6 backdrop-blur-md shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="flex flex-col gap-2">
          <div className="flex ml-6 sm:ml-8 h-4 relative w-full pr-8">
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="text-[8px] sm:text-[10px] text-muted-foreground absolute whitespace-nowrap"
                style={{
                  left: `${(m.index / weeksYear.length) * 100}%`,
                }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-1 w-full justify-between items-start">
            <div className="flex flex-col gap-[2px] sm:gap-[3px] w-5 sm:w-6 shrink-0 pt-[1px]">
              {DAYS_SHORT.map((day, i) => (
                <span
                  key={i}
                  className="text-[7px] sm:text-[9px] h-1.5 sm:h-3 leading-none text-muted-foreground flex items-center justify-center"
                >
                  {i % 2 === 1 ? day : ""}
                </span>
              ))}
            </div>

            <div className="flex flex-1 justify-between gap-[1px] sm:gap-[2px]">
              {weeksYear.map((week: ContributionWeek, i: number) => (
                <div
                  key={i}
                  className="flex flex-col gap-[1px] sm:gap-[3px] flex-1"
                >
                  {week.contributionDays.map((day: ContributionDay) => (
                    <motion.div
                      key={day.date}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.001 }}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={cn(
                        "w-full aspect-square rounded-[1px] sm:rounded-[2px] relative cursor-pointer border border-transparent hover:border-white/30 dark:hover:border-white/20",
                        getColor(day.contributionCount),
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getColorLevel(lvl: number) {
  switch (lvl) {
    case 0:
      return "bg-secondary/50 dark:bg-muted/10";
    case 1:
      return "bg-emerald-200 dark:bg-[#0e4429]";
    case 2:
      return "bg-emerald-400 dark:bg-[#006d32]";
    case 3:
      return "bg-emerald-500 dark:bg-[#26a641]";
    case 4:
      return "bg-emerald-600 dark:bg-[#39d353]";
    default:
      return "";
  }
}

function getColor(count: number) {
  if (count === 0)
    return getColorLevel(0) + " hover:bg-secondary dark:hover:bg-muted/30";
  if (count <= 3) return getColorLevel(1) + " hover:brightness-110";
  if (count <= 6) return getColorLevel(2) + " hover:brightness-110";
  if (count <= 9) return getColorLevel(3) + " hover:brightness-110";
  return getColorLevel(4) + " hover:brightness-110";
}

function generateMockData(): ContributionData {
  const weeks: ContributionWeek[] = [];
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 365);
  for (let i = 0; i < 52; i++) {
    const contributionDays: ContributionDay[] = [];
    for (let j = 0; j < 7; j++) {
      const rand = Math.random();
      const count = rand > 0.8 ? Math.floor(Math.random() * 5) + 1 : 0;
      contributionDays.push({
        contributionCount: count,
        date: currentDate.toISOString().split("T")[0],
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push({ contributionDays });
  }
  return { totalContributions: 0, weeks };
}
