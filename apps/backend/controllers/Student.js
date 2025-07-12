import Contest from "../models/Contest.js";
import Problem from "../models/Problem.js";
import Student from "../models/Student.js";
import axios from "axios";

//Controller to add students in the table
export async function addStudent(req, res) {  
    try {
        //should be added in form
        const { cfHandle } = req.body;
        const {email, phone} = req.body
        
        //extract data from codeforces api
        const {data} = await axios.get(`https://codeforces.com/api/user.info?handles=${cfHandle}`)
        const contestHistory = await axios.get(`https://codeforces.com/api/user.rating?handle=${cfHandle}`)
        const problemHistory = await axios.get(`https://codeforces.com/api/user.status?handle=${cfHandle}`)
        const problemData = await axios.get('https://codeforces.com/api/problemset.problems')

        //extract the required data
        const user = data?.result[0]
        //below both are arrays
        const history = contestHistory?.data?.result
        const problems = problemHistory?.data?.result
        const allProblems = problemData?.data?.result?.problems
        
        const participatedContest = history.map(c => c.contestId)
        // console.log("Participated Contests:", participatedContest);

        const solvedProblems = problems.filter(sub => 
            participatedContest.includes(sub.contestId) &&
            sub.author.participantType === "CONTESTANT" &&
            sub.verdict === "OK"
        )
        // console.log("solved Problems:", solvedProblems);

        // Validate user data
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Validate required fields
        if (!email || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new student
        const newStudent = {
            firstName: user.firstName,
            lastName: user.lastName,
            email,
            phone,
            handle: user.handle,
            rating: user.rating || 0,
            maxRating: user.maxRating || 0,
        };

        // Save to student database 
        const student = await Student.create(newStudent);

        // console.log('Contest history:', history);

        //create student contest history profile
        if (history.length > 0) {
            await Promise.all(
                history.map(contest => {
                    const eachContestSolvedProblem = solvedProblems.filter(c => c.contestId === contest.contestId);
                    const eachContestGivenProblems = allProblems.filter(p => p.contestId === contest.contestId);

                    const contestData = {
                        student:     student._id,
                        date:        new Date(contest.ratingUpdateTimeSeconds * 1000).toISOString(),
                        contestId:   contest.contestId,
                        contestName: contest.contestName,
                        oldRating:   contest.oldRating,
                        newRating:   contest.newRating,
                        rank:        contest.rank || 0,
                        unsolvedProblems: eachContestGivenProblems.length - eachContestSolvedProblem.length 
                    };
                    return Contest.create(contestData);
                })
            );
        }

        //create student problems history profile
        if (problems.length > 0) {
            const accepted = problems.filter(s => s.verdict === "OK")

            await Promise.all(
                accepted.map((submission) => {
                    const problemData = {
                        student: student._id,
                        name:    submission.problem.name,
                        rating:  submission.problem.rating || 0,
                        date: new Date(submission.creationTimeSeconds * 1000).toISOString(),
                    };
                    return Problem.create(problemData);
                })
            );
        }
        
        // Get the created contest and problem IDs
        const contestDataId = await Contest.find({ student: student._id }).select('_id');
        const problemsDataId = await Problem.find({ student: student._id }).select('_id');

        // console.log('Length of Contest Data IDs:', contestDataId.length);
        // console.log('Length of Problems Data IDs:', problemsDataId.length);
        
        //add the contests and problems history to student
        const completeStudentsData = await Student.findByIdAndUpdate(
            student._id,
            {
                $push: {
                    contests: {
                        $each: contestDataId,
                    },
                    problems: {
                        $each: problemsDataId,
                    }
                },
                $set: {
                    lastProblemSubmitted: problems[0].creationTimeSeconds * 1000,
                }
            },
            { new: true })
            .populate("contests")
            .populate("problems")
            .exec()

        // console.log('Student complete data added successfully:', completeStudentsData);
        res.status(201).json(completeStudentsData);
    } 
    catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

//Controller to edit students in the table
export async function editStudent(req, res) {
    try {
        //should be added in form
        const { cfHandle, id } = req.body;
        const {email, phone} = req.body

        const student = await Student.findById(id)
        if(!student) return res.status(400).json({ message: 'Student dont exists' });

        const oldContests = student.contests
        const oldProblems = student.problems

        //extract data from codeforces api
        const {data} = await axios.get(`https://codeforces.com/api/user.info?handles=${cfHandle}`)
        const contestHistory = await axios.get(`https://codeforces.com/api/user.rating?handle=${cfHandle}`)
        const problemHistory = await axios.get(`https://codeforces.com/api/user.status?handle=${cfHandle}`)
        const problemData = await axios.get('https://codeforces.com/api/problemset.problems')

        const user = data?.result[0]
        // console.log('User data:', user);

        const history = contestHistory?.data?.result
        const problems = problemHistory?.data?.result
        const allProblems = problemData?.data?.result?.problems

        const participatedContest = history.filter(c => c.contestId)
        const solvedProblems = problems.filter(sub => 
            participatedContest.includes(sub.contestId) &&
            sub.author.participantType === "CONTESTANT" &&
            sub.verdict === "OK"
        )
        // console.log("solved Problems:", solvedProblems);

        // Validate user data
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Validate required fields
        if (!email || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        //Delete old contests
        {
            oldContests.length > 0 && await Contest.deleteMany({ _id: { $in: oldContests } });
        }

        //Delete old problems
        {
            oldProblems.length > 0 && await Problem.deleteMany({ _id: { $in: oldProblems } });
        }

        //Delete record of old contests and problems from student schema
        await Student.findByIdAndUpdate(
            student._id,
            {
                $pull: {
                    contests: { $in: oldContests },
                    problems: { $in: oldProblems }
                }
            },
            { new: true }
        );
        
        //Add new contests
        if (history.length > 0) {
            await Promise.all(
                history.map(contest => {
                    const eachContestSolvedProblem = solvedProblems.filter(c => c.contestId === contest.contestId);
                    const eachContestGivenProblems = allProblems.filter(p => p.contestId === contest.contestId);

                    const contestData = {
                        student:     student._id,
                        date:        new Date(contest.ratingUpdateTimeSeconds * 1000).toISOString(),
                        contestId:   contest.contestId,
                        contestName: contest.contestName,
                        oldRating:   contest.oldRating,
                        newRating:   contest.newRating,
                        rank:        contest.rank || 0,
                        unsolvedProblems: eachContestGivenProblems.length - eachContestSolvedProblem.length
                    };
                    return Contest.create(contestData);
                })
            );
        }

        //Add new problems
        if (problems.length > 0) {
            const accepted = problems.filter(s => s.verdict === "OK")

            await Promise.all(
                accepted.map((submission) => {
                    const problemData = {
                        student: student._id,
                        name:    submission.problem.name,
                        rating:  submission.problem.rating || 0,
                        date: new Date(submission.creationTimeSeconds * 1000).toISOString(),
                    };
                    return Problem.create(problemData);
                })
            );
        }

        // Get the created contest and problem IDs
        const contestDataId = await Contest.find({ student: id }).select('_id');
        const problemsDataId = await Problem.find({ student: id }).select('_id');

        // console.log('Contest Data IDs:', contestDataId);
        // console.log('Problems Data IDs:', problemsDataId);
        
        // Find student by ID and update everything
        const updatedStudent = await Student.findByIdAndUpdate(
            student._id,
            {
                $set: {
                    firstName: user.firstName || " ",
                    lastName: user.lastName || " ",
                    email,
                    phone,
                    handle: user.handle,
                    rating: user.rating || 0,
                    maxRating: user.maxRating || 0,
                    lastProblemSubmitted: problems[0].creationTimeSeconds * 1000,
                    remindersSent: 0,
                },
                $push: {
                    contests: {
                        $each: contestDataId,
                    },
                    problems: {
                        $each: problemsDataId,
                    }
                }
            },
            { new: true })
            .populate("contests")
            .populate("problems")  
            .exec()

        // console.log('Student added successfully:', updatedStudent);

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(updatedStudent);
    } 
    catch (error) {
        console.error('Error editing student:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

//Controller to delete students in the table
export async function deleteStudent(req, res) {
    try {
        // console.log("Request body -> ", req)
        const {id} = req.params;
        console.log('Student ID to delete in backend:', id);

        // Validate ID
        if (!id) {
            return res.status(400).json({ message: 'Student id is required' });
        }

        // Find and delete student
        const student = await Student.findById(id)

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (!student.contests) {
            return res.status(404).json({ message: 'Student has no contest history' });
        }
        
        await Student.findByIdAndDelete(id);
        // Delete associated contests
        await Contest.deleteMany({ _id: { $in: student.contests } });
        // Delete associated problems
        await Problem.deleteMany({ _id: { $in: student.problems } });

        res.status(200).json({ message: 'Student deleted successfully' });
    } 
    catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

//Controller to get all students in the table
export async function getAllStudents(req, res) {
    try {
        // Fetch all students with populated contests and problems
        const students = await Student.find()

        res.status(200).json(students);
    } 
    catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

//Controller to toggle email notifications for a student
export async function toggleEmail(req, res) {
    try {
        //get that from frontend
        const { id, isOff } = req.body;

        // Validate ID
        if (!id) {
            return res.status(400).json({ message: 'Student id is required' });
        }

        // Find student
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Update email notification setting
        student.emailDisabled = !isOff;
        await student.save();

        res.status(200).json({ message: 'Email notification setting updated successfully', student });
    } 
    catch (error) {
        console.error('Error toggling email notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
}