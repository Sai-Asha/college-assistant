/*
 * College information + DEMO student records used by the chat widget.
 * Everything under DEMO is fictional test data (no real students).
 * In the real deployment these come from the College Assistant agents on Kore.ai Artemis
 * and the mock APIs; here they live in the browser so the site works on GitHub Pages.
 */
window.COLLEGE = {
  name: "RGUKT Nuzvid",
  admissionSteps: [
    ["Read the notification", "Check eligibility, intake year, category rules, dates and application instructions."],
    ["Apply online", "Enter the personal, contact and school details the portal asks for."],
    ["Upload documents", "Upload clear copies in the specified format."],
    ["Submit and pay", "Review all fields, submit and pay the application fee of ₹500. Keep the acknowledgement and receipt."],
    ["Track status", "Check the portal status and messages."],
    ["Attend verification", "Go on the assigned date and bring your original documents."],
    ["Confirm admission", "Complete the required payment, documents and joining steps."]
  ],
  documents: [
    "Photograph and signature",
    "Qualifying school marks memo or equivalent academic record",
    "Date-of-birth proof",
    "Study certificates or school records for the specified years",
    "Category, income or residence certificates (for reserved categories)",
    "Application acknowledgement and payment receipt",
    "Original documents for verification"
  ],
  statuses: [
    ["Draft", "Not finally submitted", "Complete the fields and submit"],
    ["Submitted", "Application received", "Save the acknowledgement and watch for updates"],
    ["Under Verification", "Details and documents are being checked", "Check messages and respond through the portal"],
    ["Shortlisted", "Selected for the next stage", "Follow the counselling / verification steps"],
    ["Provisionally Admitted", "Admission depends on pending requirements", "Complete them by the stated date"],
    ["Admitted", "Admission confirmed", "Follow the joining instructions"],
    ["Rejected / Not Eligible", "Application did not proceed", "Read the reason; use the grievance route if applicable"]
  ],
  branches: [
    ["Computer Science and Engineering (CSE)", "Programming, algorithms, databases, operating systems, networks, software engineering"],
    ["Electronics and Communication Engineering (ECE)", "Electronic circuits, communication systems, embedded systems, signals"],
    ["Electrical and Electronics Engineering (EEE)", "Electrical machines, power systems, control systems, energy systems"],
    ["Mechanical Engineering", "Design, manufacturing, thermal systems, mechanics, materials"],
    ["Civil Engineering", "Structures, construction materials, surveying, transportation"],
    ["Chemical Engineering", "Process engineering, chemical operations, thermodynamics, process control"],
    ["Metallurgical and Materials Engineering (MME)", "Metals, materials processing and characterisation"]
  ],
  facilities: [
    "Classrooms and lecture halls for PUC and B.Tech",
    "Department laboratories and computing facilities",
    "Central library with books, study space and academic resources",
    "Hostel accommodation and mess / dining",
    "Sports grounds and indoor / outdoor recreation",
    "Student Wellness and counselling support",
    "Medical / first-aid and campus safety services",
    "Internet, computing access and the student portal"
  ],
  timings: [
    ["Administrative offices", "Mon–Fri, 9:30 AM – 4:30 PM"],
    ["Finance / Accounts", "Mon–Fri, 9:30 AM – 4:30 PM · Sat, 9:30 AM – 1:00 PM"],
    ["Central Library", "8:00 AM – 9:00 PM on working days"],
    ["Mess – breakfast", "7:00 AM – 9:00 AM"],
    ["Mess – lunch", "12:00 PM – 2:00 PM"],
    ["Mess – snacks", "4:30 PM – 5:30 PM"],
    ["Mess – dinner", "7:00 PM – 9:00 PM"],
    ["Student helpdesk", "Mon–Fri, 9:30 AM – 4:30 PM"]
  ],
  fees: [
    ["Semester fee", 80000, ""],
    ["Examination registration fee", 1200, ""],
    ["Backlog examination fee", 600, "per course"],
    ["Application fee", 500, ""],
    ["Bonafide certificate", 50, ""],
    ["Study certificate", 50, ""],
    ["Conduct certificate", 50, ""],
    ["Provisional certificate", 500, ""],
    ["Consolidated Marks Memo (CMM)", 500, ""],
    ["Transcript", 300, "per copy"],
    ["Original Degree Certificate", 1000, ""]
  ],
  dates: [
    ["Regular exam registration closes", "20 Nov 2026", "Complete registration and save the acknowledgement"],
    ["Semester fee due", "25 Nov 2026", "Pay the fee and keep the receipt"],
    ["Backlog exam registration closes", "30 Nov 2026", "Confirm eligible courses and register"],
    ["Semester assessment window", "7–18 Dec 2026", "Check the course-wise timetable, venue and reporting time"],
    ["Semester break begins", "21 Dec 2026", "Check hostel, library and office schedules"],
    ["Next semester begins", "4 Jan 2027", "Check registration and department announcements"]
  ],
  certificateSteps: [
    ["Examination Cell", "Collect the certificate application / no-dues form and fill it in."],
    ["Finance Department", "Clear any outstanding fee dues and get the Finance signature."],
    ["Library", "Return borrowed books and any college-issued laptop or equipment; get the Library signature."],
    ["Department HOD", "Get your HOD's signature."],
    ["Hostel Warden", "Complete hostel clearance, return hostel items and get the warden's signature."],
    ["Student Wellness Head", "Get the Student Wellness clearance signature."],
    ["Director", "Take the completed form for the Director's signature."],
    ["Examination Cell", "Submit the fully signed form; the certificates are processed and issued."]
  ],
  contacts: [
    ["Admissions", "Admissions Office", "admissions@rgukt.in"],
    ["Exams, results, registration", "Examination Cell", "ecell_enquiries@rguktn.ac.in · 08656-2468569"],
    ["Study, conduct, bonafide, TC, migration certificates", "Assistant Registrar's Office", "ecell_certificates@rguktn.ac.in"],
    ["Grade sheets, CMM, provisional, degree certificate", "Controller of Examinations", "coe@rguktn.ac.in"],
    ["Education verification", "Examination Cell", "eduverify@rguktn.ac.in"],
    ["Fees and payments", "Finance Office", "fo@rguktn.ac.in"],
    ["Academic rules and courses", "Dean of Academics", "dean.academics@rguktn.ac.in"],
    ["General administration", "Administrative Officer", "ao@rguktn.ac.in"],
    ["Student welfare and wellbeing", "Dean, Student Welfare", "dsw@rguktn.ac.in · dswgirls@rguktn.ac.in"],
    ["Hostel escalation", "Chief Warden", "chiefwardenboys@rguktn.ac.in · chiefwardengirls@rguktn.ac.in"],
    ["Alumni services", "Alumni Cell", "alumni@rguktn.ac.in"],
    ["Unresolved escalation", "Director's Office", "director@rguktn.ac.in · 08656-235147"]
  ]
};

window.DEMO = {
  students: [
    { studentId: "N221001", name: "Rahul Sharma", type: "current", branch: "CSE", semester: 5, email: "rahul.n221001@abcit.example" },
    { studentId: "N221002", name: "Priya Reddy", type: "current", branch: "CSE", semester: 5, email: "priya.n221002@abcit.example" },
    { studentId: "N231003", name: "Arjun Kumar", type: "current", branch: "ECE", semester: 3, email: "arjun.n231003@abcit.example" },
    { studentId: "N231004", name: "Sneha Patel", type: "current", branch: "MECH", semester: 3, email: "sneha.n231004@abcit.example" },
    { studentId: "N201005", name: "Kiran Rao", type: "graduated", branch: "CSE", email: "kiran.n201005@abcit.example" },
    { studentId: "N201006", name: "Ananya Gupta", type: "graduated", branch: "ECE", email: "ananya.n201006@abcit.example" },
    { studentId: "N191007", name: "Vikram Singh", type: "graduated", branch: "MECH", email: "vikram.n191007@abcit.example" },
    { studentId: "N201008", name: "Meera Nair", type: "graduated", branch: "CSE", email: "meera.n201008@abcit.example" }
  ],
  // latest published semester for each student: [code, subject, credits, grade]
  results: {
    N221001: { semester: 4, rows: [["CS401", "Design and Analysis of Algorithms", 4, "A"], ["CS402", "Database Management Systems", 4, "A+"], ["CS403", "Operating Systems", 4, "B+"], ["CS404", "Computer Networks", 3, "A"], ["MA401", "Probability and Statistics", 3, "B"]] },
    N221002: { semester: 4, rows: [["CS401", "Design and Analysis of Algorithms", 4, "B+"], ["CS402", "Database Management Systems", 4, "A"], ["CS403", "Operating Systems", 4, "F"], ["CS404", "Computer Networks", 3, "B"], ["MA401", "Probability and Statistics", 3, "B+"]] },
    N231003: { semester: 2, rows: [["EC201", "Network Analysis", 4, "A"], ["EC202", "Electronic Devices", 4, "B+"], ["MA201", "Engineering Mathematics II", 4, "A"], ["PH201", "Engineering Physics", 3, "B+"], ["CS201", "Programming in C", 3, "A+"]] },
    N231004: { semester: 2, rows: [["ME201", "Engineering Mechanics", 4, "F"], ["MA201", "Engineering Mathematics II", 4, "F"], ["ME202", "Engineering Drawing", 3, "B"], ["PH201", "Engineering Physics", 3, "B"], ["CS201", "Programming in C", 3, "C"]] },
    N201005: { semester: 8, rows: [["CS801", "Cloud Computing", 3, "A"], ["CS802", "Machine Learning", 3, "A+"], ["CS803", "Project Work", 8, "A"], ["HS801", "Professional Ethics", 2, "B+"]] },
    N201006: { semester: 8, rows: [["EC801", "Wireless Communication", 3, "B+"], ["EC802", "VLSI Design", 3, "A"], ["EC803", "Project Work", 8, "A"], ["HS801", "Professional Ethics", 2, "B"]] },
    N191007: { semester: 8, rows: [["ME801", "Automobile Engineering", 3, "B"], ["ME802", "Refrigeration and Air Conditioning", 3, "F"], ["ME803", "Project Work", 8, "B+"], ["HS801", "Professional Ethics", 2, "B+"]] },
    N201008: { semester: 8, rows: [["CS801", "Cloud Computing", 3, "A+"], ["CS802", "Machine Learning", 3, "A+"], ["CS803", "Project Work", 8, "A"], ["HS801", "Professional Ethics", 2, "A"]] }
  },
  backlogs: [
    { studentId: "N221002", code: "CS403", subject: "Operating Systems", semester: 4, status: "pending", attempts: 1 },
    { studentId: "N231004", code: "ME201", subject: "Engineering Mechanics", semester: 2, status: "pending", attempts: 1 },
    { studentId: "N231004", code: "MA201", subject: "Engineering Mathematics II", semester: 2, status: "pending", attempts: 1 },
    { studentId: "N191007", code: "ME802", subject: "Refrigeration and Air Conditioning", semester: 8, status: "pending", attempts: 3 },
    { studentId: "N221001", code: "MA201", subject: "Engineering Mathematics II", semester: 2, status: "cleared", attempts: 2, clearedIn: "Jan 2025" }
  ],
  fees: [
    { studentId: "N221001", year: "2026-27", tuition: 120000, hostel: 80000, mess: 5000, total: 205000, paid: 205000, pending: 0, due: "25 Nov 2026", status: "Paid" },
    { studentId: "N221002", year: "2026-27", tuition: 120000, hostel: 0, mess: 5000, total: 125000, paid: 80000, pending: 45000, due: "25 Nov 2026", status: "Partially paid" },
    { studentId: "N231003", year: "2026-27", tuition: 110000, hostel: 80000, mess: 5000, total: 195000, paid: 115000, pending: 80000, due: "25 Nov 2026", status: "Partially paid", note: "Your hostel fee payment of ₹80,000 on 2 Nov 2026 is received but not yet reconciled." },
    { studentId: "N231004", year: "2026-27", tuition: 100000, hostel: 0, mess: 5000, total: 105000, paid: 0, pending: 105000, due: "25 Nov 2026", status: "Unpaid" },
    { studentId: "N201005", year: "Final", total: 0, paid: 0, pending: 0, status: "No dues" },
    { studentId: "N201006", year: "Final", total: 1500, paid: 0, pending: 1500, status: "Dues pending", note: "Library fine: 2 books not returned." },
    { studentId: "N191007", year: "Final", total: 0, paid: 0, pending: 0, status: "No dues" },
    { studentId: "N201008", year: "Final", total: 0, paid: 0, pending: 0, status: "No dues" }
  ],
  payments: [
    { studentId: "N221001", txn: "TXN2026090112345", amount: 205000, date: "1 Sep 2026", mode: "UPI", reconciled: true },
    { studentId: "N221002", txn: "TXN2026091054321", amount: 80000, date: "10 Sep 2026", mode: "Net Banking", reconciled: true },
    { studentId: "N231003", txn: "TXN2026090567890", amount: 115000, date: "5 Sep 2026", mode: "UPI", reconciled: true },
    { studentId: "N231003", txn: "TXN2026110298765", amount: 80000, date: "2 Nov 2026", mode: "UPI", reconciled: false }
  ],
  certificates: {
    N201005: { overall: "Ready", detail: "Ready since 15 Oct 2026. Collect from the Examination Cell, Admin Block Room 104.", items: [["Original Degree Certificate", "Ready"], ["Consolidated Marks Memo", "Ready"], ["Transfer Certificate", "Ready"], ["Migration Certificate", "Ready"]] },
    N201006: { overall: "On hold", detail: "On hold: library dues of ₹1,500 pending.", items: [["Original Degree Certificate", "Ready"], ["Consolidated Marks Memo", "Ready"], ["Transfer Certificate", "On hold"], ["Migration Certificate", "Not ready"]] },
    N191007: { overall: "On hold", detail: "On hold: backlog pending in ME802. Certificates are issued after all subjects are cleared.", items: [["Original Degree Certificate", "Not ready"], ["Consolidated Marks Memo", "Not ready"], ["Transfer Certificate", "Ready"], ["Migration Certificate", "Not ready"]] },
    N201008: { overall: "Collected", detail: "All certificates were collected on 12 Aug 2025.", items: [["Original Degree Certificate", "Collected"], ["Consolidated Marks Memo", "Collected"], ["Transfer Certificate", "Collected"], ["Migration Certificate", "Collected"]] }
  }
};
