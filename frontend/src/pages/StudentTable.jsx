import { useEffect, useState } from 'react';
import CFHandleModal from '../components/CFHandleModal';
import { deleteStudent, fetchAllStudents, toggleEmailSetting } from '../services/operations/studentAPI.js';
import { useNavigate } from 'react-router-dom';
import { getCronTimeAPI, setCronTimeAPI } from '../services/operations/cronAPI.js';

export default function StudentTable({onChange}) {
  const [students, setStudents] = useState([]);
  const [syncTime, setSyncTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(false); // Track if modal is for adding or editing
  const [id, setId] = useState('');
  const navigate = useNavigate()

  const segments = ['Second', 'Minute', 'Hour', 'Day of Month', 'Month', 'Day of Week'];
  const [values, setValues] = useState(Array(6).fill(''));
  
  const handleChange = (index, val) => {
    const newValues = [...values];
    newValues[index] = val;
    setValues(newValues);
    if (onChange) onChange(newValues.join(' '));
  };

  const updatedValues = values.join(' ')
  console.log("Timer values : ", updatedValues);

  const fetchStudentsData = async () => {
    try{
      setLoading(true);
      //store data of all students from the database
      const studentData = await fetchAllStudents()
      console.log("studentData : ", studentData);

      setStudents(studentData);
      setLoading(false);
    }
    catch(error){
      console.log("Could not fetch students data")
    }
  }

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

  const handleViewDetails = (id) => {
    navigate(`/students/${id}`);
  };

  if (loading) return <p>Loading students...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Enrolled Students</h1>
        <div className="space-x-2">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download CSV
          </button>
          <button
            onClick={() => {
              setIsAdd(true)
              setModalOpen(true)}
            }
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Student
          </button>
          {/* Cron time input */}
          <div>
            <div className="flex space-x-2">
              {segments.map((label, idx) => (
                <input
                  key={label}
                  type="text"
                  placeholder={label}
                  value={values[idx]}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  className="w-20 p-1 border rounded text-center focus:outline-none focus:ring"
                />
              ))}
            </div>

            <button
              onClick={async () => {
                await setCronTimeAPI({updatedValues})
                fetchCronTime()}
              }
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>

          <div>
            This is the cron time - {syncTime}
          </div>
        </div>
      </div>

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
              <td className="px-4 py-2 border">{s.firstName}</td>
              <td className="px-4 py-2 border">{s.lastName}</td>
              <td className="px-4 py-2 border">{s.email}</td>
              <td className="px-4 py-2 border">{s.phone}</td>
              <td className="px-4 py-2 border">{s.handle}</td>
              <td className="px-4 py-2 border">{s.rating}</td>
              <td className="px-4 py-2 border">{s.maxRating}</td>
              <td className="px-4 py-2 border">{s.lastSync}</td>
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
                  <span className="ml-2">{s.emailDisabled ? 'Off' : 'On'}</span>
                </label>
              </td>
              <td className="px-4 py-2 border space-x-1">
                {/* <button
                  // onClick={() => handleViewDetails(s._id)}
                  className="px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                >
                  View CF Progress
                </button> */}
                <button
                  onClick={() => {
                    setId(s._id)
                    setModalOpen(true)}
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit Student
                </button>
                <button
                  onClick={async () => {
                    await deleteStudent(s._id)
                    fetchStudentsData()}
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Delete Student
                </button>
                <button
                  onClick={() => navigate(`/students/${s._id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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