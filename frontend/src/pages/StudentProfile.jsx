import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { fetchAllContests } from "../services/operations/contestAPI.js";
import { fetchAllProblems } from "../services/operations/problemAPI.js";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  // Contest History State
  const [contestDays, setContestDays] = useState(30);
  const [contests, setContests] = useState([]);
  const [ratingSeries, setRatingSeries] = useState({ labels: [], data: [] });

  // Problem Solving Data State
  const [problemDays, setProblemDays] = useState(7);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({
    hardest: null,
    total: 0,
    avgRating: 0,
    avgPerDay: 0,
  });
  const [ratingBuckets, setRatingBuckets] = useState({
    labels: [],
    counts: [],
  });
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    fetchContestHistory();
  }, [contestDays]);
  useEffect(() => {
    fetchProblemData();
  }, [problemDays]);

  const fetchContestHistory = async () => {
    try {
      setLoading(true);

      // Fetch contests for the student
      const data = await fetchAllContests();
      console.log("Fetched contests:", data);
      setContests(data);
      const sorted = [...data].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setRatingSeries({
        labels: sorted.map((c) => new Date(c.date).toLocaleDateString()),
        data: sorted.map((c) => c.newRating),
      });

      setLoading(false);
    } 
    catch (error) {
      console.log("Could not fetch contest history");
    }
  };

  const fetchProblemData = async () => {
    try {
      setLoading(true);

      // Fetch submissions for the student
      const data = await fetchAllProblems();
      console.log("Fetched submissions:", data);
      setSubmissions(data);

      // Stats
      if (data.length) {
        const total = data.length;
        const sumRating = data.reduce((sum, s) => sum + s.rating, 0);
        const hardest = data.reduce(
          (max, s) => (s.rating > max.rating ? s : max),
          data[0]
        );
        const avgRating = (sumRating / total).toFixed(2);
        const avgPerDay = (total / problemDays).toFixed(2);
        setStats({ hardest, total, avgRating, avgPerDay });

        // Rating buckets
        const buckets = {};
        data.forEach((s) => {
          const bucket = `${Math.floor(s.rating / 100) * 100}`;
          buckets[bucket] = (buckets[bucket] || 0) + 1;
        });
        const labels = Object.keys(buckets).sort((a, b) => +a - +b);
        setRatingBuckets({ labels, counts: labels.map((l) => buckets[l]) });

        // Heatmap data: count per date
        const dateCounts = {};
        data.forEach((s) => {
          const d = new Date(s.date).toISOString().split("T")[0];
          dateCounts[d] = (dateCounts[d] || 0) + 1;
        });
        const heatmapArray = Object.entries(dateCounts).map(
          ([date, count]) => ({ date, count })
        );
        setHeatmapData(heatmapArray);
      } 
      else {
        setStats({ hardest: null, total: 0, avgRating: 0, avgPerDay: 0 });
        setRatingBuckets({ labels: [], counts: [] });
        setHeatmapData([]);
      }

      setLoading(false);
    } 
    catch (error) {
      console.log("Could not fetch problem data");
    }
  };

  if (loading) return <p>Loading students profile...</p>;
  return (
    <div className="p-4 space-y-8">

      <div className="flex gap-4 items-center justify-between">
        {/* Button to table */}
        <button
          onClick={() => navigate(`/students`)}
          className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white rounded-2xl text-lg sm:text-xl transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600"
        >
          Go to Student Table
        </button>

        <ThemeToggle/>
      </div>

      {/* Contest History */}
      <section>
        <h2 className="mt-2 text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300">Contest History</h2>
        <div className="mb-4">
          {[30, 90, 365].map((d) => (
            <button
              key={d}
              onClick={() => setContestDays(d)}
              className={`cursor-pointer px-3 py-1 mr-2 rounded ${
                contestDays === d ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {d} days
            </button>
          ))}
        </div>
        <Line
          data={{
            labels: ratingSeries.labels,
            datasets: [
              { label: "Rating", data: ratingSeries.data, fill: false },
            ],
          }}
        />

        <table className="min-w-full bg-white border mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Contest Name</th>
              <th className="px-4 py-2 border">Old → New</th>
              <th className="px-4 py-2 border">Rank</th>
              <th className="px-4 py-2 border">Unsolved</th>
            </tr>
          </thead>
          <tbody>
            {contests.length ? (
              contests.map((c) => (
                <tr key={c.contestId} className="text-center hover:bg-gray-50">
                  <td className="px-4 py-2 border">
                    {new Date(c.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">{c.contestName}</td>
                  <td className="px-4 py-2 border">
                    {c.oldRating} → {c.newRating}
                  </td>
                  <td className="px-4 py-2 border">{c.rank}</td>
                  <td className="px-4 py-2 border">{c.unsolvedProblems}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4">
                  No contests in this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Problem Solving Data */}
      <section>
        <h2 className="mt-2 text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300">Problem Solving Data</h2>
        <div className="mb-4">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setProblemDays(d)}
              className={`px-3 py-1 mr-2 rounded ${
                problemDays === d ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {d} days
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <strong className="mt-2 text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300">Most Difficult Solved:</strong>{" "}
            <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.hardest
                ? `${stats.hardest.rating} (${stats.hardest.name})`
                : "—"
              }
            </span>
          </div>
          <div>
            <strong className="mt-2 text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300">Total Solved:</strong>
            <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.total}
            </span>
          </div>
          <div>
            <strong className="mt-2 text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300">Avg. Rating:</strong>
            <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.avgRating}
            </span>
          </div>
          <div>
            <strong className="mt-2 text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300">Avg. per Day:</strong>
            <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.avgPerDay}
            </span>
          </div>
        </div>
        <Bar
          data={{
            labels: ratingBuckets.labels,
            datasets: [{ label: "# solved", data: ratingBuckets.counts }],
          }}
        />

        <div className="mt-8">
          <h3 className="mt-2 text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300">Submission Heatmap</h3>
          <CalendarHeatmap
            startDate={
              new Date(new Date().setDate(new Date().getDate() - problemDays))
            }
            endDate={new Date()}
            values={heatmapData}
            classForValue={(value) => {
              if (!value) return "color-empty";
              if (value.count < 2) return "color-scale-1";
              if (value.count < 5) return "color-scale-2";
              return "color-scale-3";
            }}
            showWeekdayLabels
          />
        </div>
      </section>

    </div>
  );
}
