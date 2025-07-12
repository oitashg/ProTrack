import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { fetchAllContests } from '../services/operations/contestAPI.js';
import { fetchAllProblems } from '../services/operations/problemAPI.js';
import { fetchAllStudents } from '../services/operations/studentAPI.js';
import { useNavigate, useParams } from 'react-router-dom';
import { ModeToggle } from '@/components/ModeToggle.jsx';

// shadcn/ui components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Profile
  const [student, setStudent] = useState(null);

  // Contest history
  const [contestDays, setContestDays] = useState(30);
  const [contests, setContests] = useState([]);
  const [ratingSeries, setRatingSeries] = useState({ labels: [], data: [] });

  // Problem data
  const [problemDays, setProblemDays] = useState(7);
  const [stats, setStats] = useState({ hardest: null, total: 0, avgRating: 0, avgPerDay: 0 });
  const [ratingBuckets, setRatingBuckets] = useState({ labels: [], counts: [] });
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    fetchContestHistory(contestDays);
  }, [contestDays]);

  useEffect(() => {
    fetchProblemData(problemDays);
  }, [problemDays]);

  useEffect(() => {
    fetchStudentData()
  }, [])

  //fetch student data
  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllStudents();
      setStudent(data.find((s) => s._id === id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // fetch contest history
  const fetchContestHistory = async (days) => {
    setLoading(true);
    try {
      const all = await fetchAllContests();
      const mine = all.filter((c) => c.student === id);
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      const recent = mine.filter((c) => new Date(c.date).getTime() >= cutoff);
      const sorted = recent.sort((a, b) => new Date(a.date) - new Date(b.date));
      setContests(sorted);
      setRatingSeries({
        labels: sorted.map((c) => new Date(c.date).toLocaleDateString()),
        data: sorted.map((c) => c.newRating),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // fetch problem data
  const fetchProblemData = async (days) => {
    setLoading(true);
    try {
      const all = await fetchAllProblems();
      const mine = all.filter((p) => p.student === id);
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      const recent = mine.filter((p) => new Date(p.date).getTime() >= cutoff);

      // stats
      const total = recent.length;
      const sumRating = recent.reduce((sum, s) => sum + s.rating, 0);
      const hardest = recent.reduce((mx, s) => (s.rating > mx.rating ? s : mx), recent[0] || {});
      const avgRating = total ? (sumRating / total).toFixed(2) : 0;
      const avgPerDay = total ? (total / days).toFixed(2) : 0;
      setStats({ hardest, total, avgRating, avgPerDay });

      // buckets
      const buckets = {};
      recent.forEach((s) => {
        const b = String(Math.floor(s.rating / 100) * 100);
        buckets[b] = (buckets[b] || 0) + 1;
      });
      const labels = Object.keys(buckets).sort((a, b) => +a - +b);
      setRatingBuckets({ labels, counts: labels.map((l) => buckets[l]) });

      // heatmap
      const dateCounts = {};
      mine.forEach((s) => {
        const d = new Date(s.date).toISOString().split('T')[0];
        dateCounts[d] = (dateCounts[d] || 0) + 1;
      });
      setHeatmapData(Object.entries(dateCounts).map(([date, count]) => ({ date, count })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !student) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="p-6 space-y-6 w-3/4 mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/students')}>Back</Button>
        <ModeToggle />
      </div>

      {/* Details of the student */}
      <Card>
        <CardHeader>
          <CardTitle><strong>{student.firstName} {student.lastName}</strong></CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Email: </strong>{student.email}</p>
          <p><strong>Phone: </strong>{student.phone}</p>
          <p><strong>CF Handle: </strong>{student.handle}</p>
        </CardContent>
      </Card>

      {/* Contest History and Line Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Contests</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={String(contestDays)} className="mb-4">
            <TabsList>
              {[30,90,365].map((d) => (
                <TabsTrigger key={d} value={String(d)} onClick={() => setContestDays(d)}>
                  {d}d
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          {
            contests.length > 0 && (
              <Line
                data={{labels: ratingSeries.labels, datasets:[{ label:'Rating', data: ratingSeries.data, fill:false, tension:0.1 }]}}
              />
            )
          }
          <Separator className="my-6" />
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  {['Date','Name','Old→New','Rank','Unsolved'].map(h => <th key={h} className="p-2">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {contests.map((c) => (
                  <tr key={c.contestId} className="hover:bg-muted/50">
                    <td className="p-2">{new Date(c.date).toLocaleDateString()}</td>
                    <td className="p-2">{c.contestName}</td>
                    <td className="p-2">{c.oldRating}→{c.newRating}</td>
                    <td className="p-2">{c.rank}</td>
                    <td className="p-2">{c.unsolvedProblems}</td>
                  </tr>
                ))}
                {!contests.length && (
                  <tr><td colSpan={5} className="p-4 text-center">No contests</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Problem solving history and bar graph */}
      <Card>
        <CardHeader>
          <CardTitle>Problems</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={String(problemDays)} className="mb-4">
            <TabsList>
              {[7,30,90].map((d) => (
                <TabsTrigger key={d} value={String(d)} onClick={() => setProblemDays(d)}>
                  {d}d
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          {
            stats.total > 0 && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>Hardest: <strong>{stats.hardest?.name} ({stats.hardest?.rating})</strong></div>
                  <div>Total: <strong>{stats.total}</strong></div>
                  <div>Avg Rating: <strong>{stats.avgRating}</strong></div>
                  <div>Per Day: <strong>{stats.avgPerDay}</strong></div>
                </div>

                <Bar data={{ labels: ratingBuckets.labels, datasets:[{ label:'# solved', data: ratingBuckets.counts }] }} />
              </>
            )
          }

          {!stats.total && (
            <p className='text-center'>No problems</p>
          )}
        </CardContent>
      </Card>
      
      {/* Submission Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarHeatmap
            startDate={new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)}
            endDate={new Date()}
            values={heatmapData}
            className="w-full h-48"
            showWeekdayLabels
            classForValue={(v) => !v ? 'color-empty' : v.count < 2 ? 'color-scale-1' : v.count < 5 ? 'color-scale-2' : 'color-scale-3'}
          />
        </CardContent>
      </Card>
      
    </div>
  );
}
