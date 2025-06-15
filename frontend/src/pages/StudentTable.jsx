import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function StudentTable() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/students');
      setStudents(data);
    } 
    catch (err) {
      console.error('Failed to fetch students', err);
    } 
    finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    // TODO: Open add-student modal or navigate to add form
    navigate('/students/new');
  };

  const handleEdit = (id) => {
    // TODO: Open edit modal or navigate to edit form
    navigate(`/students/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(`/api/students/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error('Failed to delete student', err);
    }
  };

  const handleDownloadCSV = () => {
    const header = ['Name', 'Email', 'Phone', 'CF Handle', 'Current Rating', 'Max Rating'];
    const rows = students.map(s => [
      s.name,
      s.email,
      s.phone,
      s.cfHandle,
      s.currentRating,
      s.maxRating
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


  // inside StudentTable component
  const toggleEmail = async (id, currentlyDisabled) => {
    try {
      const { data: updated } = await axios.put(`/api/students/${id}/email-settings`, {
        emailDisabled: !currentlyDisabled
      });
      setStudents((prev) =>
        prev.map((s) => (s._id === id ? updated : s))
      );
    } catch (err) {
      console.error('Failed to toggle email setting:', err);
    }
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
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Student
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Student
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Delete Student
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Name</th>
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
              <td className="px-4 py-2 border">{s.name}</td>
              <td className="px-4 py-2 border">{s.email}</td>
              <td className="px-4 py-2 border">{s.phone}</td>
              <td className="px-4 py-2 border">{s.cfHandle}</td>
              <td className="px-4 py-2 border">{s.currentRating}</td>
              <td className="px-4 py-2 border">{s.maxRating}</td>
              <td className="px-4 py-2 border">{s.lastSync ? new Date(s.lastSync).toLocaleString() : '—'}</td>
              <td className="px-4 py-2 border">{s.remindersSent}</td>
              <td className="px-4 py-2 border">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={!s.emailDisabled}
                    onChange={() => toggleEmail(s._id, s.emailDisabled)}
                    className="form-checkbox"
                  />
                  <span className="ml-2">{s.emailDisabled ? 'Off' : 'On'}</span>
                </label>
              </td>
              <td className="px-4 py-2 border space-x-1">
                <button
                  onClick={() => handleViewDetails(s._id)}
                  className="px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                >
                  View CF Progress
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
    </div>
  );
}
