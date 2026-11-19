/*
 * College Assistant — browser demo of the chat flow.
 * Mirrors the Artemis design: a concierge that routes to Campus Guide,
 * Student Verification (email OTP), Academic Records and Fees & Dues.
 * Runs fully client-side with fictional data from js/data.js.
 */
(function () {
  "use strict";
  const C = window.COLLEGE, D = window.DEMO;
  const CLOSE = "Anything else I can help with?";
  const OTP_MINUTES = 5, MAX_ATTEMPTS = 3, LOCK_MINUTES = 15;

  /* ---------- helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
  const table = (head, rows, numCols = []) =>
    "<table><thead><tr>" + head.map((h, i) => `<th${numCols.includes(i) ? ' class="num"' : ""}>${esc(h)}</th>`).join("") +
    "</tr></thead><tbody>" + rows.map((r) => "<tr>" + r.map((c, i) => `<td${numCols.includes(i) ? ' class="num"' : ""}>${c}</td>`).join("") + "</tr>").join("") +
    "</tbody></table>";
  const answer = (title, body, contact) =>
    `<h4>${esc(title)}</h4>${body}${contact ? `<p class="contact"><b>Contact:</b> ${contact}</p>` : ""}<p class="close">${CLOSE}</p>`;
  const maskEmail = (e) => {
    const [u, d] = e.split("@");
    return u.slice(0, 2) + "*".repeat(Math.max(3, u.length - 3)) + u.slice(-1) + "@" + d;
  };
  const GP = { "A+": 10, A: 9, "B+": 8, B: 7, C: 6, D: 5, F: 0 };
  const findStudent = (id) => D.students.find((s) => s.studentId === id.toUpperCase());
  const firstName = (s) => s.name.split(" ")[0];

  /* ---------- state (per page load, like a chat session) ---------- */
  const state = {
    category: null,        // "new" | "current" | "graduated"
    verified: false,
    studentId: null,       // kept out of the visible conversation where possible
    awaiting: null,        // "roll" | "otp"
    pendingIntent: null,   // personal intent to resume after verification
    otp: null,             // { code, rollNo, expiresAt, attempts, used }
    locks: {}              // rollNo -> lockedUntil
  };

  /* ---------- general answers (Campus Guide) ---------- */
  const general = {
    admission: () => answer("Admission process",
      "<ol>" + C.admissionSteps.map(([t, d]) => `<li><b>${esc(t)}:</b> ${esc(d)}</li>`).join("") + "</ol>",
      "Admissions Office, admissions@rgukt.in"),
    documents: () => answer("Documents for admission",
      "<ul>" + C.documents.map((d) => `<li>${esc(d)}</li>`).join("") + "</ul>",
      "Admissions Office, admissions@rgukt.in"),
    statuses: () => answer("Application status meanings",
      table(["Status", "Meaning", "Next step"], C.statuses.map((r) => r.map(esc))),
      "Admissions Office, admissions@rgukt.in"),
    appStatus: () => answer("Your application status",
      "<p>Your live application status is shown on the admissions portal under your application number. If it hasn't changed after the stated processing time, write to Admissions with your application number and acknowledgement.</p>",
      "Admissions Office, admissions@rgukt.in"),
    eligibility: () => answer("Eligibility",
      "<p>The programme is a six-year integrated pathway: two years of Pre-University Course (PUC) followed by four years of B.Tech. Eligibility, selection, reservation and intake are set in each year's admission notification, so check the current notification before applying.</p>",
      "Admissions Office, admissions@rgukt.in"),
    duration: () => answer("Course duration",
      "<p><b>Six years</b> in the integrated pathway: two years of PUC and four years of B.Tech.</p>"),
    branches: () => answer("Engineering branches",
      table(["Branch", "What you study"], C.branches.map((r) => r.map(esc)))),
    facilities: () => answer("Campus facilities",
      "<ul>" + C.facilities.map((f) => `<li>${esc(f)}</li>`).join("") + "</ul>"),
    timings: (t) => {
      let rows = C.timings;
      if (/mess|breakfast|lunch|dinner|snack|food/.test(t)) rows = rows.filter((r) => r[0].startsWith("Mess"));
      else if (/library/.test(t)) rows = rows.filter((r) => r[0].includes("Library"));
      else if (/finance|account/.test(t)) rows = rows.filter((r) => r[0].includes("Finance"));
      return answer("Timings", table(["Facility", "Timing"], rows.map((r) => r.map(esc))));
    },
    feeInfo: () => answer("Fee amounts",
      table(["Fee", "Amount"], C.fees.map(([n, a, u]) => [esc(n), inr(a) + (u ? " " + esc(u) : "")]), [1]) +
      "<p><b>How to pay:</b> through the bank using the Director's account details on the college fee form, or online through <b>SBI Collect</b>. Keep the receipt and transaction reference.</p>" +
      "<p><b>Semester fee due:</b> 25 Nov 2026.</p>",
      "Finance Office, fo@rguktn.ac.in"),
    dates: () => answer("Key dates",
      table(["Activity", "Date", "What to do"], C.dates.map((r) => r.map(esc)))),
    certProcess: () => answer("Certificate collection",
      "<ol>" + C.certificateSteps.map(([o, a]) => `<li><b>${esc(o)}:</b> ${esc(a)}</li>`).join("") + "</ol>" +
      "<p>Check every signature before returning the form, and keep a copy.</p>",
      "Assistant Registrar's Office, ecell_certificates@rguktn.ac.in"),
    contacts: () => answer("Who to contact",
      table(["For", "Office", "Email / phone"], C.contacts.map((r) => r.map(esc)))),
    paidPending: () => answer("Payment made but showing pending",
      "<ol><li>Keep the receipt, transaction reference, date and amount.</li><li>Check the bank or SBI Collect status.</li><li>Write to the Finance Office with these details for reconciliation.</li><li>Don't pay again until the first payment is checked.</li></ol>",
      "Finance Office, fo@rguktn.ac.in"),
    idPortal: () => answer("ID card and portal help",
      "<ul><li><b>Lost or damaged ID card:</b> report it to Student Administration (ID-card desk) with your roll number.</li><li><b>Portal login issue:</b> use the official password reset, or contact the IT Helpdesk with the error text and time.</li><li>Never share your password or OTP with anyone.</li></ul>"),
    correction: () => answer("Correcting your records",
      "<p>Contact the administrative / academic records office, name the exact field to correct, and submit the supporting document through the official channel. The assistant can't change official records.</p>",
      "Administrative Officer, ao@rguktn.ac.in"),
    hostel: () => answer("Hostel issues",
      "<p>Raise it with the Hostel Office or your warden with your hostel, block, room and a short description. For electrical or safety risks, don't touch the fitting and contact campus maintenance or security straight away.</p>",
      "Chief Warden, chiefwardenboys@rguktn.ac.in · chiefwardengirls@rguktn.ac.in"),
    wellbeing: () => answer("Support is available",
      "<p>I'm sorry you're going through this. The Student Wellness / counselling service offers private support. Please reach out to them, and if you feel unsafe right now, contact campus security or someone you trust immediately.</p>",
      "Dean, Student Welfare, dsw@rguktn.ac.in · dswgirls@rguktn.ac.in"),
    human: () => answer("Talk to a person",
      "<p>The right office can help you directly:</p><ul><li>Admissions: admissions@rgukt.in</li><li>Exams and results: ecell_enquiries@rguktn.ac.in</li><li>Fees: fo@rguktn.ac.in</li><li>Student helpdesk: Mon–Fri, 9:30 AM – 4:30 PM</li></ul>"),
    notOffered: () => answer("Not available here",
      "<p>Syllabus, hall tickets and exam schedules aren't offered through this assistant. Please check the Examination Cell notices or the course-wise timetable.</p>",
      "Examination Cell, ecell_enquiries@rguktn.ac.in")
  };

  /* ---------- personal answers (Academic Records / Fees & Dues) ---------- */
  const personal = {
    results: (s) => {
      const r = D.results[s.studentId];
      if (!r) return answer("Results", "<p>No published results are on record yet.</p>", "Examination Cell, ecell_enquiries@rguktn.ac.in");
      let pts = 0, cr = 0;
      r.rows.forEach(([, , c, g]) => { pts += GP[g] * c; cr += c; });
      const failed = r.rows.filter((x) => x[3] === "F").length;
      return answer(`Semester ${r.semester} results`,
        table(["Code", "Subject", "Credits", "Grade"], r.rows.map(([code, sub, c, g]) => [esc(code), esc(sub), c, g === "F" ? "<b>F</b>" : esc(g)]), [2, 3]) +
        `<p><b>SGPA:</b> ${(pts / cr).toFixed(2)}${failed ? ` · <b>${failed}</b> subject${failed > 1 ? "s" : ""} to clear` : ""}</p>`);
    },
    backlogs: (s) => {
      const rows = D.backlogs.filter((b) => b.studentId === s.studentId);
      const pending = rows.filter((b) => b.status === "pending");
      if (!pending.length) {
        return answer("Backlogs", "<p>Good news, you have no pending backlogs.</p>" +
          (rows.length ? table(["Code", "Subject", "Cleared in"], rows.map((b) => [esc(b.code), esc(b.subject), esc(b.clearedIn)])) : ""));
      }
      return answer("Pending backlogs",
        table(["Code", "Subject", "Semester", "Attempts"], pending.map((b) => [esc(b.code), esc(b.subject), b.semester, b.attempts]), [2, 3]) +
        `<p>The backlog exam fee is ${inr(600)} per course. Backlog exam registration closes on <b>30 Nov 2026</b>.</p>`,
        "Examination Cell, ecell_enquiries@rguktn.ac.in");
    },
    fees: (s) => {
      const f = D.fees.find((x) => x.studentId === s.studentId);
      if (!f) return answer("Fee details", "<p>No fee record found.</p>", "Finance Office, fo@rguktn.ac.in");
      let body;
      if (f.year === "Final") {
        body = table(["Record", "Amount"], [["Total dues", inr(f.total)], ["Pending", inr(f.pending)], ["Status", `<b>${esc(f.status)}</b>`]], [1]);
      } else {
        body = table(["Item", "Amount"], [
          ["Tuition fee", inr(f.tuition)], ["Hostel fee", inr(f.hostel)], ["Mess fee", inr(f.mess)],
          ["<b>Total</b>", `<b>${inr(f.total)}</b>`], ["Paid", inr(f.paid)], ["<b>Pending</b>", `<b>${inr(f.pending)}</b>`]
        ], [1]) + `<p><b>Status:</b> ${esc(f.status)} · <b>Due date:</b> ${esc(f.due)} · Academic year ${esc(f.year)}</p>`;
      }
      const pays = D.payments.filter((p) => p.studentId === s.studentId);
      if (pays.length) {
        body += "<p><b>Payments</b></p>" + table(["Date", "Amount", "Mode", "Status"],
          pays.map((p) => [esc(p.date), inr(p.amount), esc(p.mode), p.reconciled ? "Updated" : "<b>Pending update</b>"]), [1]);
      }
      if (f.note) body += `<p>${esc(f.note)}${pays.some((p) => !p.reconciled) ? " Please share the receipt and transaction reference with the Finance Office so they can update it." : ""}</p>`;
      return answer("Your fee details", body, "Finance Office, fo@rguktn.ac.in");
    },
    certStatus: (s) => {
      if (s.type !== "graduated") {
        return answer("Certificate status", "<p>Final certificate status is available for graduates. For bonafide, study or conduct certificates, contact the Assistant Registrar's Office.</p>",
          "Assistant Registrar's Office, ecell_certificates@rguktn.ac.in");
      }
      const c = D.certificates[s.studentId];
      if (!c) return answer("Certificate status", "<p>No certificate record found.</p>", "Controller of Examinations, coe@rguktn.ac.in");
      return answer(`Certificate status: ${c.overall}`,
        table(["Certificate", "Status"], c.items.map((r) => r.map(esc))) + `<p>${esc(c.detail)}</p>`,
        "Controller of Examinations, coe@rguktn.ac.in");
    }
  };

  /* ---------- intent detection ---------- */
  function detectIntent(t) {
    const my = /\b(my|mine|i|me|i'm|im|am i|do i)\b/.test(t);
    if (/\b(stress|stressed|depress|anxious|anxiety|counsel|wellbeing|well-being|lonely|suicid|personal issue)/.test(t)) return "wellbeing";
    if (/syllabus|hall ?ticket|exam (schedule|timetable|date)|timetable/.test(t)) return "notOffered";
    if (/\b(human|real person|agent|talk to|speak to|someone)\b/.test(t)) return "human";
    if (/grade ?sheet|cmm|transcript|degree certificate|no.?dues|bonafide|migration|\btc\b|conduct certificate|study certificate|collect (my )?certificate/.test(t)) {
      return /status|ready|my certificates?\b|have i/.test(t) && my ? "certStatus" : "certProcess";
    }
    if (/certificate/.test(t)) return my || /status|ready/.test(t) ? "certStatus" : "certProcess";
    if (/backlog|arrear|supply|failed (subject|course)|pending subject/.test(t)) return "backlogs";
    if (/result|marks|grade|sgpa|cgpa|score/.test(t)) return "results";
    if (/paid.*(pending|not (updated|reflect|showing))|(pending|not updated).*paid/.test(t)) return my ? "fees" : "paidPending";
    if (/\b(fee|fees|dues?|balance|payment|paid|pay)\b/.test(t)) {
      if (/how (to|can i|do i) pay|where.*pay|sbi|structure|amount|how much|cost|list|semester fee is/.test(t) && !/my (fee|dues|balance|payment)/.test(t)) return "feeInfo";
      return my || /pending|due|status|balance|history/.test(t) ? "fees" : "feeInfo";
    }
    if (/application status|status of (my )?application|my application/.test(t)) return "appStatus";
    if (/status mean|statuses|shortlisted|provisionally/.test(t)) return "statuses";
    if (/docum|papers needed|what to bring/.test(t)) return "documents";
    if (/eligib|qualif/.test(t)) return "eligibility";
    if (/admission|admin\w* process|apply|application|how (to|do i|can i) join|joining|enrol|\bprocess\b/.test(t)) return "admission";
    if (/how (many|long) years|duration|how long is the course|course length/.test(t)) return "duration";
    if (/branch|course|department|cse|ece|eee|mechanical|civil|chemical|program|stream/.test(t)) return "branches";
    if (/timing|what time|open|close|library|mess|breakfast|lunch|dinner|snack|hours|working hours/.test(t)) return "timings";
    if (/deadline|last date|due date|calendar|important date|semester (start|begin)|break/.test(t)) return "dates";
    if (/hostel|room|warden|light|fan|water/.test(t) && /issue|problem|not working|broken|complain/.test(t)) return "hostel";
    if (/facilit|hostel|sports|wifi|internet|medical|campus|lab/.test(t)) return "facilities";
    if (/id card|portal|password|login|log in/.test(t)) return "idPortal";
    if (/(name|dob|date of birth).*(wrong|spell|correct|change|mistake)|correction/.test(t)) return "correction";
    if (/contact|email|phone|office|whom|who (do|should) i|reach|helpdesk/.test(t)) return "contacts";
    return null;
  }
  const PERSONAL = new Set(["results", "backlogs", "fees", "certStatus"]);

  function detectCategory(t) {
    if (/new|applicant|aspirant|want to join|planning to join|admission seeker/.test(t)) return "new";
    if (/grad|alumni|alumnus|passed out|pass ?out|completed|former/.test(t)) return "graduated";
    if (/current|studying|existing|enrolled|i('| a)?m a student|\bstudent\b/.test(t)) return "current";
    return null;
  }

  const CAPABILITY = {
    new: "Great! I can help with the admission process, courses and eligibility, and general FAQs about the college. What would you like to know?",
    current: "Great! I can help with your results, backlogs and fee details, and with general FAQs and timings at the college. What do you need today?",
    graduated: "Great! I can help with your results, backlogs, dues and certificate status, plus the certificate collection process and general FAQs. What do you need today?"
  };

  /* ---------- the concierge ---------- */
  function respond(raw) {
    const text = raw.trim();
    const t = text.toLowerCase();

    if (/^(restart|start over|reset)$/.test(t)) { reset(); return null; }

    // verification sub-flow (Student Verification agent)
    if (state.awaiting === "roll") return handleRoll(text);
    if (state.awaiting === "otp") return handleOtp(text);

    // first turn: who is chatting?
    if (!state.category) {
      const cat = detectCategory(t);
      const intent = detectIntent(t);
      if (cat && !intent) { state.category = cat; return `<p>${CAPABILITY[cat]}</p>`; }
      if (cat) state.category = cat;
      if (!cat && !intent) {
        return { html: "<p>Before we start, are you a new applicant, a current student, or a graduate?</p>", chips: ["New applicant", "Current student", "Graduate"] };
      }
    }

    // the person corrects who they are ("actually I'm a current student")
    if (!state.verified && /\b(i am|i'm|im|actually)\b/.test(t)) {
      const cat = detectCategory(t);
      if (cat && cat !== state.category) {
        state.category = cat;
        if (!detectIntent(t)) return `<p>${CAPABILITY[cat]}</p>`;
      }
    }

    // short replies
    if (/^(yes|yeah|yep|sure|ok|okay|yes please|please)\W*$/.test(t)) return "<p>Sure! What would you like to know?</p>";
    if (/^(no|nope|no thanks?|no thank you|nothing( else)?|that'?s all|thanks?|thank you|thx|bye|goodbye)\b/.test(t) && !detectIntent(t)) return "<p>Glad I could help. Take care!</p>";
    if (/^(hi|hello|hey|good (morning|afternoon|evening))\W*$/.test(t)) return "<p>Hello again! What can I help you with?</p>";

    // someone else's records
    const otherRoll = text.match(/\b[nN]\d{6}\b/);
    if (otherRoll && state.verified && otherRoll[0].toUpperCase() !== state.studentId) {
      return answer("Only your own records", "<p>For privacy, I can only show records for the student who verified in this chat.</p>");
    }
    if (/\b(my )?(friend|brother|sister|son|daughter|classmate|someone else)('s)?\b/.test(t) && PERSONAL.has(detectIntent(t))) {
      return answer("Only your own records", "<p>For privacy, each student needs to verify and view their own records.</p>");
    }

    // a bare roll number starts verification
    if (/^\s*[nN]\d{6}\s*$/.test(text) && !state.verified && state.category !== "new") {
      state.awaiting = "roll";
      return handleRoll(text);
    }

    const intent = detectIntent(t);
    if (!intent) {
      return "<p>I can help with admissions, courses, fees, timings, certificates and contacts, and with your results, backlogs and fee details after a quick verification. Could you tell me what you need?</p>";
    }

    if (PERSONAL.has(intent)) {
      if (state.category === "new") {
        return answer("Personal records", "<p>Results, backlogs, fees and certificate status are for enrolled students. As a new applicant, I can help with admissions, courses, eligibility and general FAQs.</p>");
      }
      if (!state.verified) {
        state.pendingIntent = intent;
        state.awaiting = "roll";
        return "<p>To keep your records private, I'll verify you first. Please enter your <b>roll number</b> (for example, N231003).</p>";
      }
      return personal[intent](findStudent(state.studentId));
    }
    return general[intent](t);
  }

  function handleRoll(text) {
    if (/^(cancel|stop|never ?mind)$/i.test(text)) { state.awaiting = null; state.pendingIntent = null; return "<p>No problem. What else can I help with?</p>"; }
    const m = text.match(/\b[nN]\d{6}\b/);
    if (!m) return "<p>Please enter your roll number in this format: <b>N231003</b>. Type <i>cancel</i> to stop.</p>";
    const roll = m[0].toUpperCase();
    const s = findStudent(roll);
    if (!s) return "<p>I couldn't find that roll number. Please check it and try again.</p>";
    const lock = state.locks[roll];
    if (lock && Date.now() < lock) {
      state.awaiting = null;
      return `<p>Verification for this roll number is locked after too many wrong codes. Please try again in ${Math.ceil((lock - Date.now()) / 60000)} minutes.</p>`;
    }
    return sendOtp(s);
  }

  function sendOtp(s) {
    const code = String(Math.floor(100000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 900000)));
    state.otp = { code, rollNo: s.studentId, expiresAt: Date.now() + OTP_MINUTES * 60000, attempts: 0, used: false };
    state.awaiting = "otp";
    showMail(maskEmail(s.email), code);
    return `<p>I've sent a 6-digit code to <b>${esc(maskEmail(s.email))}</b>. It's valid for ${OTP_MINUTES} minutes. Please enter it here.</p>`;
  }

  function handleOtp(text) {
    const o = state.otp;
    const t = text.toLowerCase();
    if (/^(cancel|stop|never ?mind)$/.test(t)) { state.awaiting = null; state.pendingIntent = null; state.otp = null; return "<p>Verification cancelled. What else can I help with?</p>"; }
    if (/resend|new code|send again|didn'?t (get|receive)/.test(t)) return sendOtp(findStudent(o.rollNo));
    if (Date.now() > o.expiresAt) return "<p>That code has expired. Type <b>resend</b> and I'll send a new one.</p>";
    const digits = text.replace(/\D/g, "");
    if (digits.length !== 6) return `<p>Please enter the 6-digit code from the email. Type <b>resend</b> for a new code.</p>`;
    if (digits === o.code) {
      const s = findStudent(o.rollNo);
      o.used = true;
      state.verified = true; state.studentId = s.studentId; state.category = s.type; state.awaiting = null;
      const intent = state.pendingIntent; state.pendingIntent = null;
      hideMail();
      const hello = `<p>Thanks, ${esc(firstName(s))}. You're verified.</p>`;
      if (!intent) {
        return hello + `<p>What would you like to see: your results, backlogs, fee details${s.type === "graduated" ? " or certificate status" : ""}?</p>`;
      }
      return [hello, personal[intent](s)];
    }
    o.attempts += 1;
    if (o.attempts >= MAX_ATTEMPTS) {
      state.locks[o.rollNo] = Date.now() + LOCK_MINUTES * 60000;
      state.awaiting = null; state.pendingIntent = null; state.otp = null;
      return `<p>That code is incorrect, and the limit of ${MAX_ATTEMPTS} attempts is reached. Verification is locked for ${LOCK_MINUTES} minutes.</p>`;
    }
    const left = MAX_ATTEMPTS - o.attempts;
    return `<p>That code doesn't match. You have <b>${left}</b> attempt${left > 1 ? "s" : ""} left.</p>`;
  }

  /* ---------- UI ---------- */
  const ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/></svg>';
  const ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const ICON_RESET = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>';
  const ICON_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>';

  const root = document.createElement("div");
  root.innerHTML = `
    <button class="chat-fab" type="button" aria-label="Open help desk chat" title="Help desk" aria-expanded="false">${ICON_CHAT}</button>
    <section class="chat-panel" role="dialog" aria-label="Help desk chat" hidden>
      <header class="chat-head">
        <div class="avatar" aria-hidden="true">CA</div>
        <div><b>Student Help Desk</b><small><span class="dot-live"></span>RGUKT Nuzvid</small></div>
        <div class="actions">
          <button type="button" class="reset" aria-label="Restart conversation" title="Restart">${ICON_RESET}</button>
          <button type="button" class="close" aria-label="Close chat" title="Close">${ICON_X}</button>
        </div>
      </header>
      <div class="chat-log" aria-live="polite"></div>
      <form class="chat-form" autocomplete="off">
        <input type="text" name="q" placeholder="Type your message…" aria-label="Message" maxlength="300">
        <button type="submit" aria-label="Send">${ICON_SEND}</button>
      </form>
      <div class="chat-foot">Sample student records · never share your password</div>
    </section>
    <div class="mail-toast" role="status" aria-live="polite">
      <button type="button" aria-label="Dismiss">×</button>
      <div class="from"><span><b>RGUKT Nuzvid Help Desk</b> · sample inbox</span><span class="to"></span></div>
      <div>Your verification code is</div>
      <div class="code"></div>
      <div class="muted" style="font-size:12px">Valid for ${OTP_MINUTES} minutes. Don't share this code.</div>
    </div>`;
  document.body.appendChild(root);

  const fab = root.querySelector(".chat-fab"), panel = root.querySelector(".chat-panel"), log = root.querySelector(".chat-log");
  const form = root.querySelector(".chat-form"), input = form.querySelector("input");
  const toast = root.querySelector(".mail-toast");
  let started = false, busy = false;

  function showMail(to, code) {
    toast.querySelector(".to").textContent = "to " + to;
    toast.querySelector(".code").textContent = code;
    toast.classList.add("show");
  }
  function hideMail() { toast.classList.remove("show"); }
  toast.querySelector("button").onclick = hideMail;

  function scroll() { log.scrollTop = log.scrollHeight; }
  function addMsg(html, who) {
    const el = document.createElement("div");
    el.className = "msg " + who;
    if (who === "user") el.textContent = html; else el.innerHTML = html;
    log.appendChild(el); scroll();
  }
  function addChips(labels) {
    const wrap = document.createElement("div");
    wrap.className = "chips";
    labels.forEach((l) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = l;
      b.onclick = () => { wrap.remove(); send(l); };
      wrap.appendChild(b);
    });
    log.appendChild(wrap); scroll();
  }
  function greet() {
    addMsg("<p>Hello! Welcome to the RGUKT Nuzvid help desk. Are you a new applicant, a current student, or a graduate?</p>", "bot");
    addChips(["New applicant", "Current student", "Graduate"]);
  }
  function reset() {
    Object.assign(state, { category: null, verified: false, studentId: null, awaiting: null, pendingIntent: null, otp: null });
    log.innerHTML = ""; hideMail();
    const s = document.createElement("div"); s.className = "sys"; s.textContent = "New conversation"; log.appendChild(s);
    greet();
  }

  function send(text) {
    if (!text.trim() || busy) return;
    log.querySelectorAll(".chips").forEach((c) => c.remove());
    addMsg(text, "user");
    busy = true;
    const typing = document.createElement("div");
    typing.className = "msg bot typing"; typing.innerHTML = "<i></i><i></i><i></i>";
    log.appendChild(typing); scroll();
    setTimeout(() => {
      typing.remove(); busy = false;
      const out = respond(text);
      if (out == null) return;
      const list = Array.isArray(out) ? out : [out];
      list.forEach((o) => {
        if (typeof o === "string") addMsg(o, "bot");
        else { addMsg(o.html, "bot"); if (o.chips) addChips(o.chips); }
      });
      input.focus();
    }, 450 + Math.random() * 350);
  }

  function open(prefill) {
    panel.hidden = false; fab.setAttribute("aria-expanded", "true");
    const ping = fab.querySelector(".ping"); if (ping) ping.remove();
    if (!started) { started = true; greet(); }
    if (prefill) {
      // answer the page's question directly; ask category only if needed
      setTimeout(() => send(prefill), 300);
    }
    setTimeout(() => input.focus(), 200);
  }
  function close() { panel.hidden = true; fab.setAttribute("aria-expanded", "false"); fab.focus(); }

  fab.onclick = () => (panel.hidden ? open() : close());
  root.querySelector(".close").onclick = close;
  root.querySelector(".reset").onclick = reset;
  form.onsubmit = (e) => { e.preventDefault(); const v = input.value; input.value = ""; send(v); };
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) close(); });
  document.querySelectorAll("[data-ask]").forEach((el) =>
    el.addEventListener("click", (e) => { e.preventDefault(); open(el.getAttribute("data-ask")); }));
  document.querySelectorAll("[data-open-chat]").forEach((el) =>
    el.addEventListener("click", (e) => { e.preventDefault(); open(); }));

  // expose for testing in the console
  window.CollegeAssistant = { open, close, reset, respond, state };
})();
