import { useEffect, useState } from 'react';
import CFHandleModal from '../components/CFHandleModal';
import { deleteStudent, fetchAllStudents, toggleEmailSetting } from '../services/operations/studentAPI.js';
import { getCronTimeAPI, setCronTimeAPI } from '../services/operations/cronAPI.js';
import { useNavigate } from 'react-router-dom';
import { IoIosContact } from "react-icons/io";

// shadcn/ui components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from '@/components/ModeToggle';

export default function StudentTable() {
	const [students, setStudents] = useState([]);
	const [syncTime, setSyncTime] = useState('');
	const [showTime, setShowTime] = useState('');
	const [startTime, setStartTime] = useState('02:00:00');
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [isAdd, setIsAdd] = useState(false);
	const [id, setId] = useState('');
	const navigate = useNavigate();

	// Fetch cron time
	const fetchCronTime = async () => {
		setLoading(true);
		try {
			const { cronTime } = await getCronTimeAPI();
			setSyncTime(cronTime);
		} catch (err) {
			console.error('Could not fetch cron time', err);
		} finally {
			setLoading(false);
		}
	};

	const parseCronDate = (str) => {
		const [sec, min, hr] = str.split(' ');
		return `${hr}:${min}:${sec}`;
	};

	useEffect(() => {
		if (!syncTime) return;
		try {
			setShowTime(parseCronDate(syncTime));
		} catch (err) {
			console.error('Failed to parse cron date:', err);
		}
	}, [syncTime]);

	console.log("Start time -> ", startTime);
	const [hr, min, sec] = startTime.split(':');
	const cronTimeData = `${sec} ${min} ${hr} * * *`;

	// Fetch students
	const fetchStudentsData = async () => {
		setLoading(true);
		try {
			const studentData = await fetchAllStudents();
			setStudents(studentData);
		} catch (err) {
			console.error('Could not fetch students data', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchStudentsData();
		fetchCronTime();
	}, []);

	//Function to download in csv format
	const handleDownloadCSV = () => {
		const header = ['First name', 'Last name', 'Email', 'Phone', 'CF Handle', 'Current Rating', 'Max Rating', 'Last Sync', 'Reminders Sent', 'Auto Email'];
		const rows = students.map(s => [
			s.firstName, s.lastName, s.email, s.phone, s.handle,
			s.rating, s.maxRating, s.lastSync, s.remindersSent, s.emailDisabled ? 'Off' : 'On'
		]);
		const csv = [header, ...rows].map(r => r.join(',')).join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'students.csv';
		link.click();
	};

	if (loading) return <div className="spinner"></div>

	return (
		<div className="p-6 space-y-6 w-11/12 mx-auto">

			{/* Heading */}
			<div className="flex justify-between items-center">
				<h1 className="text-4xl font-bold">Enrolled Students</h1>
				<ModeToggle />
			</div>

			{/* Sync */}
			<Card>
				<CardHeader>
					<CardTitle>Manage & Sync</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-wrap gap-4 items-center justify-between">
						<div className='flex gap-2'>
							<Button onClick={handleDownloadCSV}>Download CSV</Button>
							<Button variant="outline" onClick={() => { setIsAdd(true); setModalOpen(true); }}>
								Add Student
							</Button>
						</div>

						<div className='flex flex-col gap-2'>
							<div className="flex items-center space-x-2">
									<Label htmlFor="time-picker" className="px-1">
										Time
									</Label>
									<Input
										type="time"
										id="time-picker"
										step="1"
										value={startTime}
										onChange={(e) => setStartTime(e.target.value)}
										className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
									/>

									<Button size="sm" onClick={async () => { await setCronTimeAPI({ cronTimeData }); fetchCronTime(); }}>
										Set Sync
									</Button>
									</div>

								<span className="ml-auto text-sm text-muted-foreground">
									Next sync at <strong>{showTime}</strong>
								</span>
							
						</div>



					</div>
				</CardContent>
			</Card>

			{/* Student List Table */}
			<Card>
				<CardHeader>
					<CardTitle>Students List</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								{['First name', 'Last name', 'Email', 'Phone', 'CF Handle', 'Current Rating', 'Max Rating', 'Last Sync', 'Reminders', 'Auto Email', 'Actions'].map((col) => (
									<TableHead key={col}>{col}</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{students.map((s) => (
								<TableRow key={s._id}>
									<TableCell>{s.firstName}</TableCell>
									<TableCell>{s.lastName}</TableCell>
									<TableCell>{s.email}</TableCell>
									<TableCell>{s.phone}</TableCell>
									<TableCell>{s.handle}</TableCell>
									<TableCell>{s.rating}</TableCell>
									<TableCell>{s.maxRating}</TableCell>
									<TableCell>
										{new Date(s.lastSync).toLocaleTimeString()}
									</TableCell>
									<TableCell>{s.remindersSent}</TableCell>
									<TableCell>
										<Switch
											checked={!s.emailDisabled}
											onCheckedChange={async () => { await toggleEmailSetting(s._id, s.emailDisabled); fetchStudentsData(); }}
										/>
									</TableCell>
									<TableCell className="space-x-2">
										<Button size="sm" onClick={() => { setId(s._id); setModalOpen(true); }}>
											Edit
										</Button>
										<Button size="sm" variant="destructive" onClick={async () => { await deleteStudent(s._id); fetchStudentsData(); }}>
											Delete
										</Button>
										<Button size="lg" variant="link" onClick={() => navigate(`/students/${s._id}`)}>
											<IoIosContact/>
										</Button>
									</TableCell>
								</TableRow>
							))}
							{students.length === 0 && (
								<TableRow>
									<TableCell colSpan={11} className="text-center py-4">
										No students found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Modal for Add/Edit Student */}
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
