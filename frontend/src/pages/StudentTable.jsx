import { useEffect, useState } from 'react';
import CFHandleModal from '../components/CFHandleModal';
import { deleteStudent, fetchAllStudents, toggleEmailSetting } from '../services/operations/studentAPI.js';
import { useNavigate } from 'react-router-dom';
import { getCronTimeAPI, setCronTimeAPI } from '../services/operations/cronAPI.js';
import ThemeToggle from '../components/ThemeToggle.jsx';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function StudentTable() {
  const [students, setStudents] = useState([]);
  const [syncTime, setSyncTime] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(false); // Track if modal is for adding or editing
  const [id, setId] = useState('');
  const navigate = useNavigate()

  // Fetch cron time from the database
  const fetchCronTime = async () => {
    try{
      setLoading(true);
      //fetch cron time from the database
      const {cronTime} = await getCronTimeAPI();
      console.log("cronData : ", cronTime);
      setSyncTime(cronTime);
      setLoading(false);
    }
    catch(error){
      console.log("Could not fetch cron time")
    }
  }
  
  //convert sync date and time form database to required date object format 
  const parseCronDate = (str, year = new Date().getFullYear()) => {
    // Split into [sec, min, hour, day, monStr, weekdayStr]
    const [sec, min, hour, day, monStr /*, weekday*/] = str.split(' ');

    // Map month name to index (0 = Jan, 1 = Feb, …)
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthIndex = monthNames.indexOf(monStr);
    if (monthIndex < 0) {
      throw new Error(`Unrecognized month "${monStr}"`);
    }

    // Build the Date (year, monthIndex, day, hour, min, sec)
    const date = new Date(year, monthIndex, Number(day), Number(hour), Number(min), Number(sec));

    if (isNaN(date)) {
      throw new Error(`Invalid date constructed from "${str}"`);
    }
    return date;
  }

  console.log("Sync time from database : ", syncTime);

  useEffect(() => {
    if (!syncTime) return;              
    try {
      const parsed = parseCronDate(syncTime);
      setStartDate(parsed);
    } 
    catch (err) {
      console.error('Failed to parse cron date:', err);
    }
  }, [syncTime]);

  console.log("Start date : ", startDate);
  const startDateString = startDate.toString();

  const [weekday, month, day, year, time] = startDateString.split(' ')
  const [hour, minute, second] = time.split(':')

  const cronTimeData = `${second} ${minute} ${hour} ${day} ${month} ${weekday}`;
  console.log("Cron time data : ", cronTimeData);

  // Fetch students data from the database
  const fetchStudentsData = async () => {
    try{
      setLoading(true);
      //store data of all students from the database
      const studentData = await fetchAllStudents()

      setStudents(studentData);
      setLoading(false);
    }
    catch(error){
      console.log("Could not fetch students data")
    }
  }

  console.log("Students data : ", students);
  
  useEffect(() => {
    //it was being called twice due to strict mode in react
    fetchStudentsData(),
    fetchCronTime()
  }, []);

  //Download CSV function
  const handleDownloadCSV = () => {
    const header = ['First name', 'Last name', 'Email', 'Phone', 'Codeforces Handle', 'Current Rating', 'Max Rating', 'Last Sync', 'Reminders Sent', 'Auto Email'];
    const rows = students.map(s => [
      s.firstName,
      s.lastName,
      s.email,
      s.phone,
      s.handle,
      s.rating,
      s.maxRating,
      s.lastSync,
      s.remindersSent,
      s.emailDisabled ? 'Off' : 'On'
    ]);
    const csvContent = [header, ...rows]
      .map(e => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'students.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //Convert cron expression to human-readable format
  const describeCron = (cronExpr) => {
    const [sec, min, hr, dom, mon, dow] = cronExpr.split(' ');
    const time = `${String(hr).padStart(2,'0')}:${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    const byDay   = dom === '*' ? 'every day' : `on day ${dom}`;
    const byMonth = mon === '*' ? 'every month' : `in month ${mon}`;
    const byWeek  = dow === '*' ? '' : `on day of week ${dow}`;
    return `${time} — ${byDay} of ${byMonth}${byWeek ? ', ' + byWeek : ''}`;
  }

  if (loading) return <p>Loading students...</p>;

  return (
    <div className="p-4 space-y-8">
      <ThemeToggle/>

      {/* Above table */}
      <div className="flex flex-col justify-between items-center mb-4">
        <h1 className="text-xl sm:text-5xl md:text-6xl text-gray-800 dark:text-gray-100 mb-6">Enrolled Students</h1>

        <div className="flex gap-8">

          {/* CSV and Add students */}
          <div className='flex gap-4'>
            <button
              onClick={handleDownloadCSV}
              className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white rounded-2xl text-lg sm:text-xl transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600"
            >
              Download CSV
            </button>
            <button
              onClick={() => {
                setIsAdd(true)
                setModalOpen(true)}
              }
              className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white rounded-2xl text-lg sm:text-xl transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600"
            >
              Add Student
            </button>
          </div>

          {/* Cron time input */}
          <div className='flex flex-col gap-3'>
            
            <div>
              <DatePicker selected={startDate} showTimeSelect dateFormat="Pp" onChange={(date) => setStartDate(date)}/>
            </div>

            <button
              onClick={async () => {
                await setCronTimeAPI({cronTimeData})
                fetchCronTime()}
              }
              className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white rounded-2xl text-lg sm:text-xl transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600"
            >
              OK
            </button>

            <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300">
              Sync time ---  <span className="font-mono text-gray-900 dark:text-gray-100">{startDateString}</span>
            </p>

          </div>

        </div>
      </div>
      
      {/* Table */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">First name</th>
            <th className="px-4 py-2 border">Last name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Phone</th>
            <th className="px-4 py-2 border">CF Handle</th>
            <th className="px-4 py-2 border">Current Rating</th>
            <th className="px-4 py-2 border">Max Rating</th>
            <th className="px-4 py-2 border">Last Sync</th>
            <th className="px-4 py-2 border">Remainders Sent</th>
            <th className="px-4 py-2 border">Auto Email</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id} className="text-center hover:bg-gray-50">
              <td className="px-4 py-2 border">{s?.firstName}</td>
              <td className="px-4 py-2 border">{s?.lastName}</td>
              <td className="px-4 py-2 border">{s.email}</td>
              <td className="px-4 py-2 border">{s.phone}</td>
              <td className="px-4 py-2 border">{s.handle}</td>
              <td className="px-4 py-2 border">{s.rating}</td>
              <td className="px-4 py-2 border">{s.maxRating}</td>
              <td className="px-4 py-2 border">{new Date(s.lastSync).toLocaleDateString()} {new Date(s.lastSync).toLocaleTimeString()}</td>
              <td className="px-4 py-2 border">{s.remindersSent}</td>
              <td className="px-4 py-2 border">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={!s.emailDisabled}
                    onChange={async () => {
                      await toggleEmailSetting(s._id, s.emailDisabled)
                      fetchStudentsData()}
                    }
                    className="form-checkbox"
                  />
                </label>
              </td>

              {/* Actions */}
              <td className="flex flex-col gap-2 px-4 py-2 border space-x-1">
                <button
                  onClick={() => {
                    setId(s._id)
                    setModalOpen(true)}
                  }
                  className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white rounded-2xl text-lg sm:text-xl transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600"
                >
                  Edit Student
                </button>
                <button
                  onClick={async () => {
                    await deleteStudent(s._id)
                    fetchStudentsData()}
                  }
                  className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white rounded-2xl text-lg sm:text-xl transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600"
                >
                  Delete Student
                </button>
                <button
                  onClick={() => navigate(`/students/${s._id}`)}
                  className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white rounded-2xl text-lg sm:text-xl transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600"
                >
                  Profile
                </button>
              </td>
              
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-2">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for adding/editing student */}
      <CFHandleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        isAddMode={isAdd}
        setIsAdd={setIsAdd}
        id={id}
        onSuccess={() => fetchStudentsData()}
      />
    </div>
  );
}